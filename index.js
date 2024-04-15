import crypto from "crypto";
import fs from "fs";
import path from "path";
import { createBlockHeader } from "./src/createBlockHeader.js";
import { createCoinbaseTransaction } from "./src/createCoinbaseTransaction.js";
import { executeScript } from "./src/scriptExecution.js";
import { selectTransaction } from "./src/selectTransaction.js";
import { serializeTransaction } from "./src/serializeTransaction.js";
import { serializeWitnessTransaction } from "./src/serializeWitnessTransaction.js";
import { Block } from "./src/types.js";
import { calculateTxId, serializeVarInt } from "./src/utils.js";
import { isValidAddresses } from "./src/verifyAddress.js";

const mempoolPath = "./mempool";

const transactions = new Map();
fs.readdirSync(mempoolPath).forEach((filename) => {
  const transaction = JSON.parse(
    fs.readFileSync(path.join(mempoolPath, filename), "utf8")
  );
  transactions.set(filename, transaction);
});

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
    console.log("Invalid TxId")
    return;
  }
  transaction["TxId"] = TxId.toString("hex");
  transaction["wTxId"] = wTxId.toString("hex");

  // Script and Signature Validation
  const result = executeScript(transaction);
  if (!result) {
    return false;
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

// Sort transactions by fee and size
const selectedTransaction = selectTransaction(validTransactions);
const transactionNumber = serializeVarInt(selectedTransaction.length);

// Create Coinbase Transaction
const coinbaseTx = createCoinbaseTransaction(fee, selectedTransaction);
const serializedCoinbaseTx = serializeTransaction(coinbaseTx);
const serializedWitnessCoinbaseTx = serializeWitnessTransaction(coinbaseTx);
const coinbaseTxId = calculateTxId(serializedCoinbaseTx);
const coinbaseWTxId = calculateTxId(serializedWitnessCoinbaseTx);
coinbaseTx.TxId = coinbaseTxId.toString("hex");
coinbaseTx.wTxId = coinbaseWTxId.toString("hex");
selectedTransaction.unshift(coinbaseTx);

// Create Block Header
const blockHeader = createBlockHeader(selectedTransaction);
const transactionsTxId = selectedTransaction
  .map((tx) => tx.TxId)
  .filter(Boolean)
  .join("\n");

const data = `${blockHeader}
${serializedWitnessCoinbaseTx}
${transactionsTxId}
`;

const block = new Block(
  blockHeader,
  transactionNumber,
  coinbaseTx,
  transactionsTxId
);

fs.writeFile("output.txt", data, (err) => {
  if (err) throw err;
});
