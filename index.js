import fs from "fs";
import path from "path";
import { calculateTxId, serializeVarInt } from "./utils.js";
import crypto from "crypto";
import { createBlockHeader } from "./createBlockHeader.js";
import { createCoinbaseTransaction } from "./createCoinbaseTransaction.js";
import { isValidAddresses } from "./verifyAddress.js";
import { serializeTransaction } from "./serializeTransaction.js";
import { executeScript } from "./scriptExecution.js";

const mempoolPath = "./valid-mempool";

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
//   "ff3cc5c137f8bc3aa4b58a00473b00e482a53e8e5aafbf596c053a75e6967124.json",
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
  const getFileName = crypto.createHash("sha256").update(TxId).digest("hex");
  if (fileName !== getFileName + ".json") {
    // console.log("File name does not match" + fileName);
    // return;
  }
  transaction["TxId"] = TxId.toString("hex");

  // Script and Signature Validation
  const result = executeScript(transaction);
  if (!result) {
    console.log("Transaction is invalid in: ", transaction.vin[0].txid);
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
  fee += inputTotal - outputTotal;

  validTransactions.push(transaction);
});
console.log(fee);
// const blockHeader = createBlockHeader(validTransactions);
// const transactionNumber = serializeVarInt(validTransactions.length);
// const coinbaseTx = createCoinbaseTransaction(fee);
// const serializedCoinbaseTx = serializeTransaction(coinbaseTx);
// const coinbaseTxId = calculateTxId(serializedCoinbaseTx);
// coinbaseTx.TxId = coinbaseTxId.toString("hex");
// validTransactions.unshift(coinbaseTx);
// const transactionsTxId = validTransactions.map((tx) => tx.TxId).join("\n");

// const data = `
// ${blockHeader}
// ${serializedCoinbaseTx}
// ${transactionsTxId}
// `;
// class Block {
//   constructor(blockHeader, transactionNumber, coinbaseTx, transactionsTxId) {
//     this.blockHeader = blockHeader;
//     this.transactionNumber = transactionNumber.toString("hex");
//     this.coinbaseTx = coinbaseTx;
//     this.transactionsTxId = transactionsTxId;
//   }
// }

// const block = new Block(
//   blockHeader,
//   transactionNumber,
//   coinbaseTx,
//   transactionsTxId
// );

// fs.writeFile("output.txt", data, (err) => {
//   if (err) throw err;
//   console.log("The file has been saved!");
// });
