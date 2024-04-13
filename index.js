import crypto from "crypto";
import fs from "fs";
import path from "path";
import { createBlockHeader } from "./createBlockHeader.js";
import { createCoinbaseTransaction } from "./createCoinbaseTransaction.js";
import { executeScript } from "./scriptExecution.js";
import { selectTransaction } from "./selectTransaction.js";
import { serializeTransaction } from "./serializeTransaction.js";
import { serializeWitnessTransaction } from "./serializeWitnessTransaction.js";
import { calculateTxId, serializeVarInt } from "./utils.js";
import { isValidAddresses } from "./verifyAddress.js";

const mempoolPath = "./mempool";

const transactions = new Map();
fs.readdirSync(mempoolPath).forEach((filename) => {
  const transaction = JSON.parse(
    fs.readFileSync(path.join(mempoolPath, filename), "utf8")
  );
  transactions.set(filename, transaction);
});

// const transaction = {
//   txid: "ffd77a505db6e6ebdccda183dd8590d5ae8bad19445c5377d2b3765a518938de",
//   version: 1,
//   locktime: 0,
//   vin: [
//     {
//       txid: "46b3b07ca9d4fd64b8f776507178d1514433d46dd5117b3289815d33c2993fb6",
//       vout: 1,
//       prevout: {
//         scriptpubkey: "0014dd95cc4ae6a28843e191640f524561c2590a5e5e",
//         scriptpubkey_asm:
//           "OP_0 OP_PUSHBYTES_20 dd95cc4ae6a28843e191640f524561c2590a5e5e",
//         scriptpubkey_type: "v0_p2wpkh",
//         scriptpubkey_address: "bc1qmk2ucjhx52yy8cv3vs84y3tpcfvs5hj7hk786n",
//         value: 487531,
//       },
//       scriptsig: "",
//       scriptsig_asm: "",
//       witness: [
//         "304402207272dd9e06bee9353d9c9cd2286228b92138acf8bc915f166d89f86f799c28f2022074364651821b78c8843ec96daa3dbc30177117e171a56bcbd2415b40c8eae48e01",
//         "027e6eaec3e8c3d82ed82c3bdf95047c7ea98e83b17a0f770bc570a3a74da7b02d",
//       ],
//       is_coinbase: false,
//       sequence: 4294967295,
//     },
//   ],
//   vout: [
//     {
//       scriptpubkey: "0014870753ec6eb9608a824843749cbb2ec8d7278d08",
//       scriptpubkey_asm:
//         "OP_0 OP_PUSHBYTES_20 870753ec6eb9608a824843749cbb2ec8d7278d08",
//       scriptpubkey_type: "v0_p2wpkh",
//       scriptpubkey_address: "bc1qsur48mrwh9sg4qjggd6fewewertj0rggz8k5jx",
//       value: 441895,
//     },
//     {
//       scriptpubkey: "0014ca1e903254ad2daa0f793b3b9d6550d83c2bb227",
//       scriptpubkey_asm:
//         "OP_0 OP_PUSHBYTES_20 ca1e903254ad2daa0f793b3b9d6550d83c2bb227",
//       scriptpubkey_type: "v0_p2wpkh",
//       scriptpubkey_address: "bc1qeg0fqvj545k65rme8vae6e2smq7zhv38ekf358",
//       value: 41829,
//     },
//   ],
//   size: 222,
//   weight: 561,
//   fee: 3807,
//   status: {
//     confirmed: true,
//     block_height: 834464,
//     block_hash:
//       "0000000000000000000177a0869a911a2b65c9bdcd5a8bcb02b68f305bee848e",
//     block_time: 1710308296,
//   },
//   hex: "01000000000101b63f99c2335d8189327b11d56dd4334451d178715076f7b864fdd4a97cb0b3460100000000ffffffff0227be060000000000160014870753ec6eb9608a824843749cbb2ec8d7278d0865a3000000000000160014ca1e903254ad2daa0f793b3b9d6550d83c2bb2270247304402207272dd9e06bee9353d9c9cd2286228b92138acf8bc915f166d89f86f799c28f2022074364651821b78c8843ec96daa3dbc30177117e171a56bcbd2415b40c8eae48e0121027e6eaec3e8c3d82ed82c3bdf95047c7ea98e83b17a0f770bc570a3a74da7b02d00000000",
// };

// transactions.set(
//   "0ad04c1cbefa43938b56ee53e4a9b0c55f96613988042927c5216c490a2e6dc0.json",
//   transaction
// );

let validTransactions = [];
let fee = 0;

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
  const result = executeScript(transaction);
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
  fee = inputTotal - outputTotal;
  transaction["fee"] = fee;
  validTransactions.push(transaction);
});

const selectedTransaction = selectTransaction(validTransactions);
const transactionNumber = serializeVarInt(selectedTransaction.length);
const coinbaseTx = createCoinbaseTransaction(fee, selectedTransaction);
const serializedCoinbaseTx = serializeTransaction(coinbaseTx);
const serializedWitnessCoinbaseTx = serializeWitnessTransaction(coinbaseTx);
const coinbaseTxId = calculateTxId(serializedCoinbaseTx);
const coinbaseWTxId = calculateTxId(serializedWitnessCoinbaseTx);
coinbaseTx.TxId = coinbaseTxId.toString("hex");
coinbaseTx.wTxId = coinbaseWTxId.toString("hex");
selectedTransaction.unshift(coinbaseTx);
const blockHeader = createBlockHeader(selectedTransaction);
const transactionsTxId = selectedTransaction
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
