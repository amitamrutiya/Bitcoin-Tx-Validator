import fs from "fs";
import path from "path";

import { calculateTxId, serializeVarInt } from "./utils.js";
import crypto from "crypto";
import { createBlockHeader } from "./createBlockHeader.js";
import { createCoinbaseTransaction } from "./createCoinbaseTransaction.js";
import { isValidAddresses } from "./verifyAddress.js";
import { serializeTransaction } from "./serializeTransaction.js";
import { executeScript } from "./scriptExecution.js";

const mempoolPath = "./mempool";

const transactions = new Map();
fs.readdirSync(mempoolPath).forEach((filename) => {
  const transaction = JSON.parse(
    fs.readFileSync(path.join(mempoolPath, filename), "utf8")
  );
  // if (
  //   transaction.vin.length === 1 &&
  //   transaction.vin[0].witness !== undefined &&
  //   transaction.vin[0].prevout.scriptpubkey_type === "v0_p2wpkh"
  // ) {
  // transactions.set(filename, transaction);
  // }
});

const transaction = {
  version: 2,
  locktime: 0,
  vin: [
    {
      txid: "6d57c863b52f812a74a742ca185f3672d30fab0941989c7f3ecaa6b9c69ef65f",
      vout: 1,
      prevout: {
        scriptpubkey: "a914d84e569b6e08184a576417226b27ab0b01c0303787",
        scriptpubkey_asm:
          "OP_HASH160 OP_PUSHBYTES_20 d84e569b6e08184a576417226b27ab0b01c03037 OP_EQUAL",
        scriptpubkey_type: "p2sh",
        scriptpubkey_address: "3MQjj28SJ5n4h9XXTzudZS2Sxm97pAZkuV",
        value: 3592047,
      },
      scriptsig: "160014835f3378e186cda9ef674042b2272f333e7a7f4b",
      scriptsig_asm:
        "OP_PUSHBYTES_22 0014835f3378e186cda9ef674042b2272f333e7a7f4b",
      witness: [
        "30440220207dab70062734c729b35024d5c61a1b90dd95aeb740172fe4350960a8ec48c202205002b6cc63afb8a05431994140592b675737db71c07e093f7b5ada6363679cb701",
        "0394bd74ea55eb0c8acf11ea27da5a46fc6bc795e51e72f79c24e5ab9cf53ba88b",
      ],
      is_coinbase: false,
      sequence: 4294967293,
      inner_redeemscript_asm:
        "OP_0 OP_PUSHBYTES_20 835f3378e186cda9ef674042b2272f333e7a7f4b",
    },
  ],
  vout: [
    {
      scriptpubkey: "0014db562202f7393129acba87250f17312ad39a52b6",
      scriptpubkey_asm:
        "OP_0 OP_PUSHBYTES_20 db562202f7393129acba87250f17312ad39a52b6",
      scriptpubkey_type: "v0_p2wpkh",
      scriptpubkey_address: "bc1qmdtzyqhh8ycjnt96sujs79e39tfe554k7rz7p2",
      value: 3589558,
    },
  ],
};

transactions.set(
  "6d57c863b52f812a74a742ca185f3672d30fab0941989c7f3ecaa6b9c69ef65f.json",
  transaction
);
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
    console.log("File name does not match" + fileName);
    // return;
  }
  transaction["TxId"] = TxId.toString("hex");

  // Script and Signature Validation
  const result = executeScript(transaction);
  if (!result) {
    console.log("Transaction is invalid");
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
  fee += inputTotal - outputTotal;

  validTransactions.push(transaction);
});
// console.log(fee);
const blockHeader = createBlockHeader(validTransactions);
const transactionNumber = serializeVarInt(validTransactions.length);
const coinbaseTx = createCoinbaseTransaction(fee);
const serializedCoinbaseTx = serializeTransaction(coinbaseTx);
const coinbaseTxId = calculateTxId(serializedCoinbaseTx);
coinbaseTx.TxId = coinbaseTxId.toString("hex");
validTransactions.unshift(coinbaseTx);
const transactionsTxId = validTransactions.map((tx) => tx.TxId).join("\n");

const data = `
${blockHeader}
${serializedCoinbaseTx}
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
  console.log("The file has been saved!");
});
