import { sha256Double } from "./utils.js";

export function createCoinbaseTransaction(amount, transactions) {
  const witnessReservedValue = Buffer.alloc(32).toString("hex");
  const witnessRootHash = createMerkleRootofwTxid(transactions);
  const wTxidCommitment = `6a24aa21a9ed${sha256Double(
    witnessRootHash + witnessReservedValue
  ).toString("hex")}`;
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
      scriptpubkey: wTxidCommitment,
    },
  ];
  coinbaseTransaction.marker = "00";
  coinbaseTransaction.flag = "01";

  return coinbaseTransaction;
}

// Create merkle root
function createMerkleRootofwTxid(transactions) {
  let merkleTree = [];
  for (const tx of transactions) {
    merkleTree.push(Buffer.from(tx.wTxId, "hex").reverse());
  }
  while (merkleTree.length > 1) {
    const nextTree = [];
    if (merkleTree.length % 2 === 1) {
      merkleTree.push(merkleTree[merkleTree.length - 1]);
    }
    for (let i = 0; i < merkleTree.length; i += 2) {
      const left = merkleTree[i];
      const right = merkleTree[i + 1];
      const data = Buffer.concat([left, right]);
      const hash = sha256Double(data);
      nextTree.push(hash);
    }

    merkleTree = nextTree;
  }
  return merkleTree[0].toString("hex");
}
