import { createMerkleRoot, hash256 } from "./utils.js";

// Function to create a coinbase transaction
export function createCoinbaseTransaction(amount, transactions) {
  // Create a 32-byte buffer and convert it to a hexadecimal string
  const witnessReservedValue = Buffer.alloc(32).toString("hex");

  // Map over the transactions and get the witness transaction ID (wTxId) of each
  let wtxids = transactions.map((tx) => tx.wTxId);

  // Add the witness reserved value to the start of the wtxids array
  wtxids.unshift(witnessReservedValue);

  // Create the Merkle root of the wtxids
  const witnessRootHash = createMerkleRoot(wtxids);

  // Hash the concatenation of the witness root hash and the witness reserved value
  const witnessCommitment = hash256(witnessRootHash + witnessReservedValue);

  // Create the script public key for the witness commitment
  const scriptPubKeyForWitnessCommitment = `6a24aa21a9ed${witnessCommitment}`;

  // Define the structure of the coinbase transaction
  const coinbaseTransaction = {
    version: 1,
    locktime: 0,
    marker: "00",
    flat: "01",
    vin: [
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
    ],
    vout: [
      {
        value: amount,
        scriptpubkey: "76a914edf10a7fac6b32e24daa5305c723f3de58db1bc888ac",
      },
      {
        value: "0000000000000000",
        scriptpubkey: scriptPubKeyForWitnessCommitment,
      },
    ],
  };
  // Return the coinbase transaction
  return coinbaseTransaction;
}
