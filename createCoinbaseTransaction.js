import { createMerkleRoot, hash256 } from "./utils.js";
import { createHash } from "crypto";

export function createCoinbaseTransaction(amount, transactions) {
  const witnessReservedValue = Buffer.alloc(32).toString("hex");
  let wtxids = transactions.map((tx) => tx.wTxId);
  wtxids.unshift(witnessReservedValue);
  const witnessRootHash = createMerkleRoot(wtxids);
  // console.log("merkle root hash: ", witnessRootHash);
  const witnessCommitment = hash256(witnessRootHash + witnessReservedValue);
  const scriptPubKeyForWitnessCommitment = `6a24aa21a9ed${witnessCommitment}`;
  // console.log("wTxidCommitment: ", witnessCommitment);
  const coinbaseTransaction = {};
  coinbaseTransaction.version = 1;
  coinbaseTransaction.locktime = 0;
  coinbaseTransaction.vin = [
    {
      txid: "0000000000000000000000000000000000000000000000000000000000000000",
      vout: "ffffffff",
      scriptsig:
        "03000000184d696e656420627920416e74506f6f6c373946205b8160a4256c0000946e0100",
      sequence: "ffffffff",
      witness: [
        "0000000000000000000000000000000000000000000000000000000000000000",
      ],
    },
  ];
  coinbaseTransaction.vout = [
    {
      value: amount,
      scriptpubkey: "76a914edf10a7fac6b32e24daa5305c723f3de58db1bc888ac",
    },
    {
      value: "0000000000000000",
      scriptpubkey: scriptPubKeyForWitnessCommitment,
    },
  ];
  coinbaseTransaction.marker = "00";
  coinbaseTransaction.flag = "01";

  return coinbaseTransaction;
}