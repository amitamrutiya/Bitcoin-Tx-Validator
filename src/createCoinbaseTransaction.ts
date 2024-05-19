import { Transaction } from "./types";
import { createMerkleRoot, hash256 } from "./utils";

interface WTxid {
  wTxId: string;
}

// Function to create a coinbase transaction
export function createCoinbaseTransaction(
  amount: number,
  transactions: WTxid[]
): Transaction {
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
  const coinbaseTransaction: Transaction = {
    version: 1,
    locktime: 0,
    fee: 0,
    weight: 0,
    TxId: "",
    wTxId: "",
    vin: [
      {
        txid: "0000000000000000000000000000000000000000000000000000000000000000",
        vout: parseInt("ffffffff", 16),
        scriptsig:
          "03000000184d696e656420627920416e74506f6f6c373946205b8160a4256c0000946e0100",
        sequence: parseInt("ffffffff", 16),
        witness: [
          "0000000000000000000000000000000000000000000000000000000000000000",
        ],
        is_coinbase: true,
        inner_redeemscript_asm: "",
        inner_witnessscript_asm: "",
        prevout: {
          scriptpubkey: "",
          scriptpubkey_address: "",
          scriptpubkey_asm: "",
          scriptpubkey_type: "",
          value: 0,
        },
        scriptsig_asm: "",
      },
    ],
    vout: [
      {
        value: amount,
        scriptpubkey: "76a914edf10a7fac6b32e24daa5305c723f3de58db1bc888ac",
        scriptpubkey_address: "",
        scriptpubkey_asm: "",
        scriptpubkey_type: "",
      },
      {
        value: 0,
        scriptpubkey: scriptPubKeyForWitnessCommitment,
        scriptpubkey_address: "",
        scriptpubkey_asm: "",
        scriptpubkey_type: "",
      },
    ],
  };
  // Return the coinbase transaction
  return coinbaseTransaction;
}
