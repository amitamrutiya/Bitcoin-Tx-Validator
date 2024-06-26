import { TransactionSchema } from "@/utils/schema";
import { createMerkleRoot, reverseBytes, hash256 } from "./utils";

// Converts the target difficulty into bits for the block header
function targetToBits(target: string): string {
  let targetBigInt = BigInt("0x" + target);
  let exponent = 0;
  while (targetBigInt > BigInt(0)) {
    targetBigInt >>= BigInt(8);
    exponent++;
  }
  let coefficientBigInt =
    BigInt("0x" + target) >> (BigInt(8) * (BigInt(exponent) - BigInt(3)));
  if ((coefficientBigInt & BigInt(0x00800000)) !== BigInt(0)) {
    coefficientBigInt >>= BigInt(8);
    exponent++;
  }
  let bitsBigInt =
    (BigInt(exponent) << BigInt(24)) | (coefficientBigInt & BigInt(0x007fffff));
  return bitsBigInt.toString(16).padStart(8, "0");
}

// Returns the current Unix timestamp
function dateStringToUnixTime(): number {
  const date = new Date();
  return Math.floor(date.getTime() / 1000);
}

// Convert a number to fit inside a field that is a specific number of bytes e.g. field(1, 4) = 00000001
function field(data: number, size: number): string {
  return BigInt(data)
    .toString(16)
    .padStart(size * 2, "0");
}

// Creates a new block header for a set of transactions
export function createBlockHeader(transactions: TransactionSchema[]): string {
  // Define the target difficulty for the block
  const target =
    "0000ffff00000000000000000000000000000000000000000000000000000000";
  // Define the version of the block
  const version = "4";
  // Define the hash of the previous block
  const prevblock =
    "0000000000000000000000000000000000000000000000000000000000000000";
  // Get the current time
  const time = dateStringToUnixTime();
  // Convert the target difficulty to bits
  const bits = targetToBits(target);
  // Initialize the nonce
  let nonce = 0;
  // Get all transaction IDs
  const allTxids = transactions.map((tx) => tx.TxId!);
  // Create the Merkle root of the transactions
  const merkleroot = createMerkleRoot(allTxids);

  // Create the block header
  let header =
    reverseBytes(field(parseInt(version), 4)) +
    reverseBytes(prevblock) +
    merkleroot +
    reverseBytes(field(time, 4)) +
    reverseBytes(bits);

  // Start mining the block
  while (true) {
    // Hash the block header with the current nonce
    const attempt = header + reverseBytes(field(nonce, 4));
    const result = reverseBytes(hash256(attempt));

    // If the hash is less than the target, the block has been successfully mined
    if (BigInt("0x" + result) < BigInt("0x" + target)) {
      break;
    }

    // If the hash is not less than the target, increment the nonce and try again
    nonce++;
  }
  // Add the successful nonce to the block header
  header = header + reverseBytes(field(nonce, 4));
  // Return the block header
  return header;
}
