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
import { selectTransaction } from "./selectTransaction.js";

const mempoolPath = "./mempool";

const transactions = new Map();
fs.readdirSync(mempoolPath).forEach((filename) => {
  const transaction = JSON.parse(
    fs.readFileSync(path.join(mempoolPath, filename), "utf8")
  );
  transactions.set(filename, transaction);
});

// const transaction1 = {
//   txid: "0c43c7f0c6ba6a59de1a66b7932b56c2737ca0efb26bb6d3d5011ec57d50cc00",
//   version: 2,
//   locktime: 0,
//   vin: [
//     {
//       txid: "5525faff4e6da81939ad70703cbf5a2129d34dcff217cb869745f6da0c658e0d",
//       vout: 2,
//       prevout: {
//         scriptpubkey: "a91422baf11c8ab5c935dd0c74d9e898a70d8f20693887",
//         scriptpubkey_asm:
//           "OP_HASH160 OP_PUSHBYTES_20 22baf11c8ab5c935dd0c74d9e898a70d8f206938 OP_EQUAL",
//         scriptpubkey_type: "p2sh",
//         scriptpubkey_address: "34rer1hXqwoXkdkJC9ny6JzHnLSKm6ffQF",
//         value: 917071,
//       },
//       scriptsig: "16001498d452471b13eee620e8d99770761731d1ffb89c",
//       scriptsig_asm:
//         "OP_PUSHBYTES_22 001498d452471b13eee620e8d99770761731d1ffb89c",
//       witness: [
//         "304402201c1a2e2fea485b9678554c0f698701510604e6c84302a8a84656a9e767570277022070de0e63cd5430a5b9e622f6da033ab13c53d568abd89e3c4099df3c452096be01",
//         "02742674c19ed520ff01a18d12c624ceb650b75d202b4472e44fd68c642593b061",
//       ],
//       is_coinbase: false,
//       sequence: 4294967293,
//       inner_redeemscript_asm:
//         "OP_0 OP_PUSHBYTES_20 98d452471b13eee620e8d99770761731d1ffb89c",
//     },
//   ],
//   vout: [
//     {
//       scriptpubkey: "001421c330dfb348135950a3d58f540e4e484951a4fe",
//       scriptpubkey_asm:
//         "OP_0 OP_PUSHBYTES_20 21c330dfb348135950a3d58f540e4e484951a4fe",
//       scriptpubkey_type: "v0_p2wpkh",
//       scriptpubkey_address: "bc1qy8pnphanfqf4j59r6k84grjwfpy4rf870hfggh",
//       value: 277000,
//     },
//     {
//       scriptpubkey: "a91422baf11c8ab5c935dd0c74d9e898a70d8f20693887",
//       scriptpubkey_asm:
//         "OP_HASH160 OP_PUSHBYTES_20 22baf11c8ab5c935dd0c74d9e898a70d8f206938 OP_EQUAL",
//       scriptpubkey_type: "p2sh",
//       scriptpubkey_address: "34rer1hXqwoXkdkJC9ny6JzHnLSKm6ffQF",
//       value: 635761,
//     },
//   ],
// };
// const transaction2 = {
//   txid: "ffd919f6375d14bc6cc07af141dc2ca2f4d75a421146c2a3c7746a831efdf1ea",
//   version: 2,
//   locktime: 0,
//   vin: [
//     {
//       txid: "ece731f93b136697eb0369606ac2a7969b3d77691a082ffb3cb19d469b7d466a",
//       vout: 3,
//       prevout: {
//         scriptpubkey: "76a91475d616cf3f45edb8640770bc718bee468db9139788ac",
//         scriptpubkey_asm:
//           "OP_DUP OP_HASH160 OP_PUSHBYTES_20 75d616cf3f45edb8640770bc718bee468db91397 OP_EQUALVERIFY OP_CHECKSIG",
//         scriptpubkey_type: "p2pkh",
//         scriptpubkey_address: "1Bk4Xchs2nJVcz9PavUyozprDXs24uLz4A",
//         value: 990000,
//       },
//       scriptsig:
//         "4830450221008b776cb507dcdb1ad15bf5c0555add8e8c839ff146e73122c328105c4594a279022000923813f4487b624d1bf98e49ab9da9f2b3dc081e3c11fbf7070439787c2aaa012103bea5d859ec5d95c449c736a0f19a5e52fdacf8b6b96afeaa415cd49f11e6a07c",
//       scriptsig_asm:
//         "OP_PUSHBYTES_72 30450221008b776cb507dcdb1ad15bf5c0555add8e8c839ff146e73122c328105c4594a279022000923813f4487b624d1bf98e49ab9da9f2b3dc081e3c11fbf7070439787c2aaa01 OP_PUSHBYTES_33 03bea5d859ec5d95c449c736a0f19a5e52fdacf8b6b96afeaa415cd49f11e6a07c",
//       is_coinbase: false,
//       sequence: 4294967295,
//     },
//   ],
//   vout: [
//     {
//       scriptpubkey: "0014a159b3ac03bb4222bbd087e917fca699ca9d3f68",
//       scriptpubkey_asm:
//         "OP_0 OP_PUSHBYTES_20 a159b3ac03bb4222bbd087e917fca699ca9d3f68",
//       scriptpubkey_type: "v0_p2wpkh",
//       scriptpubkey_address: "bc1q59vm8tqrhdpz9w7ssl530l9xn89f60mgntzutg",
//       value: 987256,
//     },
//   ],
//   size: 189,
//   weight: 756,
//   fee: 2744,
//   status: {
//     confirmed: true,
//     block_height: 834638,
//     block_hash:
//       "000000000000000000025f742c626208ac87e0b7d15054abb4a19ca2d735a54e",
//     block_time: 1710405325,
//   },
//   hex: "02000000016a467d9b469db13cfb2f081a69773d9b96a7c26a606903eb9766133bf931e7ec030000006b4830450221008b776cb507dcdb1ad15bf5c0555add8e8c839ff146e73122c328105c4594a279022000923813f4487b624d1bf98e49ab9da9f2b3dc081e3c11fbf7070439787c2aaa012103bea5d859ec5d95c449c736a0f19a5e52fdacf8b6b96afeaa415cd49f11e6a07cffffffff0178100f0000000000160014a159b3ac03bb4222bbd087e917fca699ca9d3f6800000000",
// };
// const transactions = [
//   {
//     txid: "ffd919f6375d14bc6cc07af141dc2ca2f4d75a421146c2a3c7746a831efdf1ea",
//     version: 2,
//     locktime: 0,
//     vin: [
//       {
//         txid: "ece731f93b136697eb0369606ac2a7969b3d77691a082ffb3cb19d469b7d466a",
//         vout: 3,
//         prevout: {
//           scriptpubkey: "76a91475d616cf3f45edb8640770bc718bee468db9139788ac",
//           scriptpubkey_asm:
//             "OP_DUP OP_HASH160 OP_PUSHBYTES_20 75d616cf3f45edb8640770bc718bee468db91397 OP_EQUALVERIFY OP_CHECKSIG",
//           scriptpubkey_type: "p2pkh",
//           scriptpubkey_address: "1Bk4Xchs2nJVcz9PavUyozprDXs24uLz4A",
//           value: 990000,
//         },
//         scriptsig:
//           "4830450221008b776cb507dcdb1ad15bf5c0555add8e8c839ff146e73122c328105c4594a279022000923813f4487b624d1bf98e49ab9da9f2b3dc081e3c11fbf7070439787c2aaa012103bea5d859ec5d95c449c736a0f19a5e52fdacf8b6b96afeaa415cd49f11e6a07c",
//         scriptsig_asm:
//           "OP_PUSHBYTES_72 30450221008b776cb507dcdb1ad15bf5c0555add8e8c839ff146e73122c328105c4594a279022000923813f4487b624d1bf98e49ab9da9f2b3dc081e3c11fbf7070439787c2aaa01 OP_PUSHBYTES_33 03bea5d859ec5d95c449c736a0f19a5e52fdacf8b6b96afeaa415cd49f11e6a07c",
//         is_coinbase: false,
//         sequence: 4294967295,
//       },
//     ],
//     vout: [
//       {
//         scriptpubkey: "0014a159b3ac03bb4222bbd087e917fca699ca9d3f68",
//         scriptpubkey_asm:
//           "OP_0 OP_PUSHBYTES_20 a159b3ac03bb4222bbd087e917fca699ca9d3f68",
//         scriptpubkey_type: "v0_p2wpkh",
//         scriptpubkey_address: "bc1q59vm8tqrhdpz9w7ssl530l9xn89f60mgntzutg",
//         value: 987256,
//       },
//     ],
//     size: 189,
//     weight: 756,
//     fee: 2744,
//     status: {
//       confirmed: true,
//       block_height: 834638,
//       block_hash:
//         "000000000000000000025f742c626208ac87e0b7d15054abb4a19ca2d735a54e",
//       block_time: 1710405325,
//     },
//     hex: "02000000016a467d9b469db13cfb2f081a69773d9b96a7c26a606903eb9766133bf931e7ec030000006b4830450221008b776cb507dcdb1ad15bf5c0555add8e8c839ff146e73122c328105c4594a279022000923813f4487b624d1bf98e49ab9da9f2b3dc081e3c11fbf7070439787c2aaa012103bea5d859ec5d95c449c736a0f19a5e52fdacf8b6b96afeaa415cd49f11e6a07cffffffff0178100f0000000000160014a159b3ac03bb4222bbd087e917fca699ca9d3f6800000000",
//   },
//   {
//     txid: "0c43c7f0c6ba6a59de1a66b7932b56c2737ca0efb26bb6d3d5011ec57d50cc00",
//     version: 2,
//     locktime: 0,
//     vin: [
//       {
//         txid: "5525faff4e6da81939ad70703cbf5a2129d34dcff217cb869745f6da0c658e0d",
//         vout: 2,
//         prevout: {
//           scriptpubkey: "a91422baf11c8ab5c935dd0c74d9e898a70d8f20693887",
//           scriptpubkey_asm:
//             "OP_HASH160 OP_PUSHBYTES_20 22baf11c8ab5c935dd0c74d9e898a70d8f206938 OP_EQUAL",
//           scriptpubkey_type: "p2sh",
//           scriptpubkey_address: "34rer1hXqwoXkdkJC9ny6JzHnLSKm6ffQF",
//           value: 917071,
//         },
//         scriptsig: "16001498d452471b13eee620e8d99770761731d1ffb89c",
//         scriptsig_asm:
//           "OP_PUSHBYTES_22 001498d452471b13eee620e8d99770761731d1ffb89c",
//         witness: [
//           "304402201c1a2e2fea485b9678554c0f698701510604e6c84302a8a84656a9e767570277022070de0e63cd5430a5b9e622f6da033ab13c53d568abd89e3c4099df3c452096be01",
//           "02742674c19ed520ff01a18d12c624ceb650b75d202b4472e44fd68c642593b061",
//         ],
//         is_coinbase: false,
//         sequence: 4294967293,
//         inner_redeemscript_asm:
//           "OP_0 OP_PUSHBYTES_20 98d452471b13eee620e8d99770761731d1ffb89c",
//       },
//     ],
//     vout: [
//       {
//         scriptpubkey: "001421c330dfb348135950a3d58f540e4e484951a4fe",
//         scriptpubkey_asm:
//           "OP_0 OP_PUSHBYTES_20 21c330dfb348135950a3d58f540e4e484951a4fe",
//         scriptpubkey_type: "v0_p2wpkh",
//         scriptpubkey_address: "bc1qy8pnphanfqf4j59r6k84grjwfpy4rf870hfggh",
//         value: 277000,
//       },
//       {
//         scriptpubkey: "a91422baf11c8ab5c935dd0c74d9e898a70d8f20693887",
//         scriptpubkey_asm:
//           "OP_HASH160 OP_PUSHBYTES_20 22baf11c8ab5c935dd0c74d9e898a70d8f206938 OP_EQUAL",
//         scriptpubkey_type: "p2sh",
//         scriptpubkey_address: "34rer1hXqwoXkdkJC9ny6JzHnLSKm6ffQF",
//         value: 635761,
//       },
//     ],
//   },
// ];

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
