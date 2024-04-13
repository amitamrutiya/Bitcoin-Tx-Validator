import fs from "fs";
import path from "path";
import { calculateTxId, serializeVarInt } from "./utils.js";
import crypto from "crypto";
import { createBlockHeader } from "./createBlockHeader.js";
import { createCoinbaseTransaction } from "./createCoinbaseTransaction.js";
import { isValidAddresses } from "./verifyAddress.js";
import { serializeTransaction } from "./serializeTransaction.js";
import { executeScript } from "./scriptExecution.js";
import { serializeWitnessTransaction } from "./serializeWitnessTransaction.js";

const mempoolPath = "./mempool";

const transactions = new Map();
fs.readdirSync(mempoolPath).forEach((filename) => {
  const transaction = JSON.parse(
    fs.readFileSync(path.join(mempoolPath, filename), "utf8")
  );
  // if (
  // transaction.vin.length === 2 &&
  // transaction.vin[0].witness === undefined &&
  // transaction.vin[0].prevout.scriptpubkey_type === "p2pkh" &&
  // transaction.vin[1].witness === undefined &&
  // transaction.vin[1].prevout.scriptpubkey_type === "p2pkh"
  // ) {
  transactions.set(filename, transaction);
  // }
});

// const transaction = {
//   version: 1,
//   locktime: 0,
//   vin: [
//     {
//       txid: "3b7dc918e5671037effad7848727da3d3bf302b05f5ded9bec89449460473bbb",
//       vout: 16,
//       prevout: {
//         scriptpubkey: "0014f8d9f2203c6f0773983392a487d45c0c818f9573",
//         scriptpubkey_asm:
//           "OP_0 OP_PUSHBYTES_20 f8d9f2203c6f0773983392a487d45c0c818f9573",
//         scriptpubkey_type: "v0_p2wpkh",
//         scriptpubkey_address: "bc1qlrvlygpudurh8xpnj2jg04zupjqcl9tnk5np40",
//         value: 37079526,
//       },
//       scriptsig: "",
//       scriptsig_asm: "",
//       witness: [
//         "30440220780ad409b4d13eb1882aaf2e7a53a206734aa302279d6859e254a7f0a7633556022011fd0cbdf5d4374513ef60f850b7059c6a093ab9e46beb002505b7cba0623cf301",
//         "022bf8c45da789f695d59f93983c813ec205203056e19ec5d3fbefa809af67e2ec",
//       ],
//       is_coinbase: false,
//       sequence: 4294967295,
//     },
//   ],
//   vout: [
//     {
//       scriptpubkey: "76a9146085312a9c500ff9cc35b571b0a1e5efb7fb9f1688ac",
//       scriptpubkey_asm:
//         "OP_DUP OP_HASH160 OP_PUSHBYTES_20 6085312a9c500ff9cc35b571b0a1e5efb7fb9f16 OP_EQUALVERIFY OP_CHECKSIG",
//       scriptpubkey_type: "p2pkh",
//       scriptpubkey_address: "19oMRmCWMYuhnP5W61ABrjjxHc6RphZh11",
//       value: 100000,
//     },
//     {
//       scriptpubkey: "0014ad4cc1cc859c57477bf90d0f944360d90a3998bf",
//       scriptpubkey_asm:
//         "OP_0 OP_PUSHBYTES_20 ad4cc1cc859c57477bf90d0f944360d90a3998bf",
//       scriptpubkey_type: "v0_p2wpkh",
//       scriptpubkey_address: "bc1q44xvrny9n3t5w7lep58egsmqmy9rnx9lt6u0tc",
//       value: 36977942,
//     },
//   ],
// };
// transactions.set(
//   "ff3cc5c137f8bc3aa4b58a00473b00e482a53e8e5aafbf596c053a75e6967124.json",
//   transaction
// );

let validTransactions = [];
let fee = 0;
let p2trUnspendable = { value: 0 };

transactions.forEach((transaction, fileName) => {
  // Address Validation
  const isValidAddress = isValidAddresses(transaction);
  if (!isValidAddress) {
    console.log("Invalid Address");
    return;
  }

  // Transaction ID Validation
  const serializedTransaction = serializeTransaction(transaction);
  const TxId = calculateTxId(serializedTransaction);
  const serializedWitnessTransaction = serializeWitnessTransaction(transaction);
  const wTxId = calculateTxId(serializedWitnessTransaction);
  const getFileName = crypto.createHash("sha256").update(TxId).digest("hex");
  if (fileName !== getFileName + ".json") {
    console.log("File name does not match" + fileName);
    // return;
  }
  transaction["TxId"] = TxId.toString("hex");
  transaction["wTxId"] = wTxId.toString("hex");

  // Script and Signature Validation
  const result = executeScript(transaction, p2trUnspendable);
  if (!result) {
    // console.log("Transaction is invalid in: ", transaction.vin[0].txid);
    return false;
  } else {
    // console.log("Transaction is valid in: ", transaction.vin[0].txid);
  }

  // Output Validation
  let inputTotal = transaction.vin.reduce(
    (total, input) => total + input.prevout.value,
    0
  );
  let outputTotal = transaction.vout.reduce(
    (total, output) => total + output.value,
    0
  );
  if (outputTotal > inputTotal) {
    console.log("Output total exceeds input total");
    return false; // Output total exceeds input total
  }
  if (result) {
    fee += inputTotal - outputTotal;
    validTransactions.push(transaction);
  }
});
// console.log(fee);
const blockHeader = createBlockHeader(validTransactions);
const transactionNumber = serializeVarInt(validTransactions.length);
const coinbaseTx = createCoinbaseTransaction(fee, validTransactions);
const serializedCoinbaseTx = serializeTransaction(coinbaseTx);
const serializedWitnessCoinbaseTx = serializeWitnessTransaction(coinbaseTx);
const coinbaseTxId = calculateTxId(serializedCoinbaseTx);
const coinbaseWTxId = calculateTxId(serializedWitnessCoinbaseTx);
coinbaseTx.TxId = coinbaseTxId.toString("hex");
coinbaseTx.wTxId = coinbaseWTxId.toString("hex");
validTransactions.unshift(coinbaseTx);
const transactionsTxId = validTransactions
  .map((tx) => tx.TxId)
  .filter(Boolean)
  .join("\n");

const data = `${blockHeader}
${serializedWitnessCoinbaseTx}
${transactionsTxId}
`;
class Block {
  constructor(blockHeader, transactionNumber, coinbaseTx, transactionsTxId) {
    this.blockHeader = blockHeader;
    this.transactionNumber = transactionNumber.toString("hex");
    this.coinbaseTx = coinbaseTx;
    this.transactionsTxId = transactionsTxId;
  }
}

const block = new Block(
  blockHeader,
  transactionNumber,
  coinbaseTx,
  transactionsTxId
);

fs.writeFile("output.txt", data, (err) => {
  if (err) throw err;
  // console.log("The file has been saved!");
});