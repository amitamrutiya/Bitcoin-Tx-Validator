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

// transactions.set(
// "ff3cc5c137f8bc3aa4b58a00473b00e482a53e8e5aafbf596c053a75e6967124.json"
// transaction
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
const transactionsTxId = validTransactions.map((tx) => tx.TxId).join("\n");

const data = `
${blockHeader}
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
