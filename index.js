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
  //   transaction.vin.length === 2 &&
  //   transaction.vin[0].witness !== undefined &&
  //   transaction.vin[0].prevout.scriptpubkey_type === "v0_p2wpkh" &&
  //   transaction.vin[1].witness !== undefined &&
  //   transaction.vin[1].prevout.scriptpubkey_type === "v0_p2wpkh"
  // ) {
  //   transactions.set(filename, transaction);
  // }
});

const transaction = {
  txid: "fe8b0e123c747e5d5f3d98ccb41cb341f607980b0ff4520e00842fd1b5e18032",
  version: 2,
  locktime: 0,
  vin: [
    {
      txid: "6bc35fe441051d210d9f0b8aa934f3bd96a394858926d2e502b659d3cd4033a5",
      vout: 7,
      prevout: {
        scriptpubkey: "001481fd5116f533935b4125dc286042bffb2303524a",
        scriptpubkey_asm:
          "OP_0 OP_PUSHBYTES_20 81fd5116f533935b4125dc286042bffb2303524a",
        scriptpubkey_type: "v0_p2wpkh",
        scriptpubkey_address: "bc1qs874z9h4xwf4ksf9ms5xqs4llv3sx5j2lav2eu",
        value: 1066987,
      },
      scriptsig: "",
      scriptsig_asm: "",
      witness: [
        "304402207a441be313cc0137653db942ccdc10e4ebb718acee6f6987cb2084fae232339702205f7ceb9dc1c5302883ae17499c929db128268c08ca8c13117734a5106427d41f01",
        "028daec24d151ce9df0e106b37e341521fdb195f4dfc985044e20369b71302acc4",
      ],
      is_coinbase: false,
      sequence: 0,
    },
    {
      txid: "d8385af736454ca96418751868677e50fcd581b56c6271c369093a802c698574",
      vout: 5,
      prevout: {
        scriptpubkey: "001481fd5116f533935b4125dc286042bffb2303524a",
        scriptpubkey_asm:
          "OP_0 OP_PUSHBYTES_20 81fd5116f533935b4125dc286042bffb2303524a",
        scriptpubkey_type: "v0_p2wpkh",
        scriptpubkey_address: "bc1qs874z9h4xwf4ksf9ms5xqs4llv3sx5j2lav2eu",
        value: 2326137,
      },
      scriptsig: "",
      scriptsig_asm: "",
      witness: [
        "3044022068bb0b753b7ea24e800a780d835b92d2c3fd4c3b89c84c7a6230286401784d3d022026cc3f2ac04cf685d3c8f9fae0e14afe2ec8cba37aaed8b269fd9f3667916a4e01",
        "028daec24d151ce9df0e106b37e341521fdb195f4dfc985044e20369b71302acc4",
      ],
      is_coinbase: false,
      sequence: 0,
    },
  ],
  vout: [
    {
      scriptpubkey: "a9149f9cac9e8126ca823f9abdc22cec2b7457a6a9c487",
      scriptpubkey_asm:
        "OP_HASH160 OP_PUSHBYTES_20 9f9cac9e8126ca823f9abdc22cec2b7457a6a9c4 OP_EQUAL",
      scriptpubkey_type: "p2sh",
      scriptpubkey_address: "3GEy3xxNRq8iK7tqy7mWXH2pACjHvG2bSN",
      value: 2000000,
    },
    {
      scriptpubkey: "00148b463132402255acaf252c06933d8caec67a9f18",
      scriptpubkey_asm:
        "OP_0 OP_PUSHBYTES_20 8b463132402255acaf252c06933d8caec67a9f18",
      scriptpubkey_type: "v0_p2wpkh",
      scriptpubkey_address: "bc1q3drrzvjqyf26ete99srfx0vv4mr848ccp85t6e",
      value: 1389362,
    },
  ],
  size: 371,
  weight: 836,
  fee: 3762,
  status: {
    confirmed: true,
    block_height: 834638,
    block_hash:
      "000000000000000000025f742c626208ac87e0b7d15054abb4a19ca2d735a54e",
    block_time: 1710405325,
  },
  hex: "02000000000102a53340cdd359b602e5d226898594a396bdf334a98a0b9f0d211d0541e45fc36b0700000000000000007485692c803a0969c371626cb581d5fc507e676818751864a94c4536f75a38d80500000000000000000280841e000000000017a9149f9cac9e8126ca823f9abdc22cec2b7457a6a9c48732331500000000001600148b463132402255acaf252c06933d8caec67a9f180247304402207a441be313cc0137653db942ccdc10e4ebb718acee6f6987cb2084fae232339702205f7ceb9dc1c5302883ae17499c929db128268c08ca8c13117734a5106427d41f0121028daec24d151ce9df0e106b37e341521fdb195f4dfc985044e20369b71302acc402473044022068bb0b753b7ea24e800a780d835b92d2c3fd4c3b89c84c7a6230286401784d3d022026cc3f2ac04cf685d3c8f9fae0e14afe2ec8cba37aaed8b269fd9f3667916a4e0121028daec24d151ce9df0e106b37e341521fdb195f4dfc985044e20369b71302acc400000000",
};

transactions.set(
  "ff3cc5c137f8bc3aa4b58a00473b00e482a53e8e5aafbf596c053a75e6967124.json",
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
    console.log("Transaction is invalid in: ", transaction.vin[0].txid);
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
