import { bech32 } from "bech32";
import bs58 from "bs58";
import { hash256Buffer } from "./utils";
import { Transaction } from "../utils/types";
import { TransactionSchema } from "@/utils/schema";

// Function to generate address based on transaction type
function generateAddress(
  publicKeyHash: string,
  transactionType: string
): string | undefined {
  if (transactionType === "p2pkh") {
    return generateLegacyAddress(publicKeyHash, 0x00);
  } else if (transactionType === "p2sh") {
    return generateLegacyAddress(publicKeyHash, 0x05);
  } else if (
    transactionType === "v0_p2wpkh" ||
    transactionType === "v0_p2wsh"
  ) {
    return convertToBech32(publicKeyHash, 0);
  } else if (transactionType === "v1_p2tr") {
    return convertToBech32(publicKeyHash, 1);
  }
}

// Function to generate legacy address (P2PKH and P2SH)
function generateLegacyAddress(
  publicKeyHash: string,
  versionByte: number
): string {
  const publicKeyHashBuffer = Buffer.from(publicKeyHash, "hex");
  // Prepend version byte to the public key hash
  const extendedPublicKeyHash1 = Buffer.concat([
    Buffer.from([versionByte]),
    publicKeyHashBuffer,
  ]);

  const hash2 = hash256Buffer(extendedPublicKeyHash1);

  // Take the first 4 bytes as checksum
  const checksum = hash2.slice(0, 4);
  // Append checksum to the public key hash
  const extendedPublicKeyHash2 = Buffer.concat([
    Buffer.from([versionByte]),
    publicKeyHashBuffer,
    checksum,
  ]);

  // Base58 encode
  const address = bs58.encode(extendedPublicKeyHash2);

  return address;
}

// Function to convert public key hash to Bech32 address
function convertToBech32(
  publicKeyHash: string,
  witnessVersion: number
): string {
  const words = bech32.toWords(Buffer.from(publicKeyHash, "hex"));
  const address = bech32.encode("bc", [witnessVersion, ...words]);
  return address;
}

// Function to extract public key hash from scriptpubkey_asm
function extractPkh(scriptpubkey_asm: string): string | null {
  const parts = scriptpubkey_asm.split(" ");
  let pkhIndex = -1;

  if (parts.includes("OP_PUSHBYTES_20")) {
    pkhIndex = parts.indexOf("OP_PUSHBYTES_20") + 1;
  } else if (parts.includes("OP_PUSHBYTES_32")) {
    pkhIndex = parts.indexOf("OP_PUSHBYTES_32") + 1;
  }

  return pkhIndex !== -1 ? parts[pkhIndex] : null;
}

// Function to validate addresses in a transaction
export function isValidAddresses(transaction: TransactionSchema): boolean {
  let isValid = true;

  // Validate input address
  for (const input of transaction.vin) {
    const scriptPubKey = input.prevout.scriptpubkey_asm;
    const pkh = extractPkh(scriptPubKey);
    const type = input.prevout.scriptpubkey_type;
    const address = pkh ? generateAddress(pkh, type) : null;
    if (type === "v1_p2tr" || type === "unknown") {
      continue;
    }
    if (address && address !== input.prevout.scriptpubkey_address) {
      console.log(
        "Input Address does not match " +
          address +
          " " +
          input.prevout.scriptpubkey_address
      );
      isValid = false;
      break;
    }
    isValid = true;
  }

  // Validate output address
  for (const output of transaction.vout) {
    const scriptPubKey = output.scriptpubkey_asm;
    const pkh = extractPkh(scriptPubKey);
    const type = output.scriptpubkey_type;
    if (type === "op_return" || type === "unknown" || type === "v1_p2tr") {
      continue;
    }
    const address = pkh ? generateAddress(pkh, type) : null;
    if (address && address !== output.scriptpubkey_address) {
      console.log(
        "Output Address does not match " +
          address +
          " " +
          output.scriptpubkey_address
      );
      isValid = false;
      break;
    }
    isValid = true;
  }

  return isValid;
}
