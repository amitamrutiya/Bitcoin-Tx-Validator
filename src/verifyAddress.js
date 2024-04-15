import { bech32 } from "bech32";
import bs58 from "bs58";
import { hash256Buffer } from "./utils";

function generateAddress(publicKeyHash, transactionType) {
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
function generateLegacyAddress(publicKeyHash, versionByte) {
  const PublicKeyHash = Buffer.from(publicKeyHash, "hex");
  // Prepend version byte to the public key hash
  const extendedPublicKeyHash1 = Buffer.concat([
    Buffer.from([versionByte]),
    PublicKeyHash,
  ]);

  const hash2 = hash256Buffer(extendedPublicKeyHash1);

  // Take the first 4 bytes as checksum
  const checksum = hash2.slice(0, 4);
  // Append checksum to the public key hash
  const extendedPublicKeyHash2 = Buffer.concat([
    Buffer.from([versionByte]),
    PublicKeyHash,
    checksum,
  ]);

  // Base58 encode
  const address = bs58.encode(extendedPublicKeyHash2);

  return address;
}

function convertToBech32(PKH, witness) {
  const witnessVersion = witness; // 5 bits prefix for PKH
  const words = bech32.toWords(Buffer.from(PKH, "hex"));
  const address = bech32.encode("bc", [witnessVersion, ...words]);
  return address;
}

function extractPkh(scriptpubkey_asm) {
  let parts = scriptpubkey_asm.split(" ");
  let pkhIndex = -1;

  if (parts.includes("OP_PUSHBYTES_20")) {
    pkhIndex = parts.indexOf("OP_PUSHBYTES_20") + 1;
  } else if (parts.includes("OP_PUSHBYTES_32")) {
    pkhIndex = parts.indexOf("OP_PUSHBYTES_32") + 1;
  }

  return pkhIndex !== -1 ? parts[pkhIndex] : null;
}

export function isValidAddresses(transaction) {
  let isValid = true;
  //validate input address
  for (let input of transaction.vin) {
    let scriptPubKey = input.prevout.scriptpubkey_asm;
    let pkh = extractPkh(scriptPubKey);
    let type = input.prevout.scriptpubkey_type;
    let address = generateAddress(pkh, type);
    if (type === "v1_p2tr" || type === "unknown") {
      continue;
    }
    if (address !== input.prevout.scriptpubkey_address) {
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

  //validate output address
  for (let output of transaction.vout) {
    let scriptPubKey = output.scriptpubkey_asm;
    let pkh = extractPkh(scriptPubKey);
    let type = output.scriptpubkey_type;
    if (type === "op_return" || type === "unknown" || type === "v1_p2tr") {
      continue;
    }
    let address = generateAddress(pkh, type);
    if (address !== output.scriptpubkey_address) {
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
