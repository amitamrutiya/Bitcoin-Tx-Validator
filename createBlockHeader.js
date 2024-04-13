import crypto from "crypto";
import { sha256Double } from "./utils.js";

function targetToBits(target) {
  let targetBigInt = BigInt("0x" + target);
  let exponent = 0;
  while (targetBigInt > 0n) {
    targetBigInt >>= 8n;
    exponent++;
  }
  let coefficientBigInt =
    BigInt("0x" + target) >> (8n * (BigInt(exponent) - 3n));
  if ((coefficientBigInt & 0x00800000n) !== 0n) {
    coefficientBigInt >>= 8n;
    exponent++;
  }
  let bitsBigInt =
    (BigInt(exponent) << 24n) | (coefficientBigInt & 0x007fffffn);
  return bitsBigInt.toString(16).padStart(8, "0");
}

function hash256(data) {
  const binary = Buffer.from(data, "hex");
  const hash1 = crypto.createHash("sha256").update(binary).digest();
  const hash2 = crypto.createHash("sha256").update(hash1).digest("hex");
  return hash2;
}

function dateStringToUnixTime() {
  var date = new Date();
  return Math.floor(date.getTime() / 1000);
}

// Convert a number to fit inside a field that is a specific number of bytes e.g. field(1, 4) = 00000001
function field(data, size) {
  return BigInt(data)
    .toString(16)
    .padStart(size * 2, "0");
}

// Reverse the order of bytes (often happens when working with raw bitcoin data)
function reversebytes(data) {
  return data.match(/../g).reverse().join("");
}

// Create merkle root
function createMerkleRootofTxid(transactions) {
  let merkleTree = [];
  for (const tx of transactions) {
    merkleTree.push(Buffer.from(tx.TxId, "hex").reverse());
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
  return merkleTree[0].reverse().toString("hex");
}

export function createBlockHeader(transactions) {
  const target =
    "0000ffff00000000000000000000000000000000000000000000000000000000";
  const version = "4";
  const prevblock =
    "0000000000000000000000000000000000000000000000000000000000000000";
  const time = dateStringToUnixTime();
  const bits = targetToBits(target);
  let nonce = 0;
  // const allTxids = transactions.map((tx) => tx.TxId);
  // const merkleroot = createMerkleRootofTxid(allTxids);
  const merkleroot = createMerkleRootofTxid(transactions);

  // Block Header (Serialized)
  let header =
    reversebytes(field(version, 4)) +
    reversebytes(prevblock) +
    reversebytes(merkleroot) +
    reversebytes(field(time, 4)) +
    reversebytes(bits);

  while (true) {
    // hash the block header
    const attempt = header + reversebytes(field(nonce, 4));
    const result = reversebytes(hash256(attempt));

    // show result
    // console.log(`${nonce}: Block Hash : ${result}`);

    // end if we get a block hash below the target
    if (BigInt("0x" + result) < BigInt("0x" + target)) {
      // console.log(`Block Header: ${attempt}`);
      break;
    }

    // increment the nonce and try again...
    nonce++;
  }
  header = header + reversebytes(field(nonce, 4));
  return header;
}

