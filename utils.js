import crypto from "crypto";
import pkg from "elliptic";
const { ec: EC } = pkg;
const ec = new EC("secp256k1");

export function serializeUInt32LE(value) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(value, 0);
  return buffer;
}

export function sha256Double(buffer) {
  return crypto
    .createHash("sha256")
    .update(crypto.createHash("sha256").update(buffer).digest())
    .digest();
}

export function serializeValue(value) {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64LE(BigInt(value));
  return buffer;
}

export function serializeVarInt(value) {
  if (value < 0xfd) {
    return serializeUInt8LE(value);
  } else if (value <= 0xffff) {
    return "fd" + serializeUInt16LE(value);
  } else if (value <= 0xffffffff) {
    return "fe" + serializeUInt32LE(value);
  } else {
    return "ff" + serializeUInt64LE(value);
  }
}

export function serializeUInt16LE(value) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value, 0);
  return buffer;
}

export function serializeUInt64LE(value) {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64LE(BigInt(value), 0);
  return buffer;
}

export function serializeUInt8LE(value) {
  const buffer = Buffer.alloc(1);
  buffer.writeUInt8(value, 0);
  return buffer;
}

export function verifySignature(
  transactionDigestHex,
  signatureHex,
  publicKeyHex
) {
  try {
    const signature = Buffer.from(signatureHex.slice(0, -2), "hex");
    const message = Buffer.from(transactionDigestHex, "hex");
    const publicKey = ec.keyFromPublic(publicKeyHex, "hex");
    const result = publicKey.verify(message, signature);
    if (!result) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function hash160(str) {
  const hex = sha256(str);
  const res = ripemd(hex);
  return res;
}

function hexStringToBuffer(hexString) {
  return new Uint8Array(
    hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
}

function bufferToHex(buffer) {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex) {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return new Uint8Array(bytes);
}

function bytesToHex(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

export function sha256(inputHex) {
  let hashBuffer = crypto
    .createHash("sha256")
    .update(hexStringToBuffer(inputHex))
    .digest();
  return bufferToHex(hashBuffer);
}

function ripemd(inputHex) {
  const hash = crypto
    .createHash("ripemd160")
    .update(hexToBytes(inputHex))
    .digest();
  return bytesToHex(hash);
}

export function calculateTxId(serializedTransaction) {
  // Hash the serialized transaction
  const hashResult = crypto
    .createHash("sha256")
    .update(Buffer.from(serializedTransaction, "hex"))
    .digest();
  const doubleHashResult = crypto
    .createHash("sha256")
    .update(hashResult)
    .digest();

  // Reverse the byte order
  const reversedHash = Buffer.from(doubleHashResult.reverse());

  return reversedHash;
}

export function parseDer(signature) {
  // Convert the DER signature from hex string to Buffer
  const signatureBuffer = Buffer.from(signature, "hex");

  // Find the start of the first integer (r)
  let rStart = 4; // Skip the header bytes and the length byte for r

  // Get the length of the first integer (r)
  const rLength = signatureBuffer[3];

  // Extract the bytes for the first integer (r)
  const r = BigInt(
    "0x" + signatureBuffer.slice(rStart, rStart + rLength).toString("hex")
  );

  // Find the start of the second integer (s)
  let sStart = rStart + 2 + rLength; // Skip the header bytes and the length byte for s

  // Get the length of the second integer (s)
  const sLength = signatureBuffer[rStart + 1 + rLength];

  // Extract the bytes for the second integer (s)
  const s = BigInt(
    "0x" + signatureBuffer.slice(sStart, sStart + sLength).toString("hex")
  );

  return { r, s };
}

