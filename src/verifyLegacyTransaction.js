import {
  serializeUInt32LE,
  serializeUInt64LE,
  serializeVarInt,
  hash256Buffer,
  verifySignature,
} from "./utils.js";

// Function to verify a legacy transaction
export default function verifyLegacyTransaction(
  transaction,
  input,
  signatures,
  publicKeys
) {
  const serialized = serializeLegacyTransaction(transaction, input, signatures);
  let validCount = 0;
  // Loop through each signature
  for (let signature of signatures) {
    // Loop through each public key
    for (let publicKey of publicKeys) {
      const sighashType = Buffer.alloc(4);
      sighashType.writeUInt32LE(parseInt(signature.slice(-2), 16), 0);
      const serializedWithSighash = Buffer.concat([serialized, sighashType]);
      const hashResult = hash256Buffer(serializedWithSighash);
      // Verify the signature
      const result = verifySignature(
        hashResult.toString("hex"),
        signature,
        publicKey
      );
      if (result) {
        validCount++;
        break;
      }
    }
  }
  const isValid = validCount === signatures.length;
  return isValid;
}

// Function to serialize a legacy transaction
function serializeLegacyTransaction(transaction, input, signatures) {
  const signatureType = signatures[0].slice(-2);
  let sighashType;
  let anyOneCanPayFlag = false;
  // Determine the sighash type and anyOneCanPay flag
  if (signatureType === "01") {
    sighashType = "ALL";
  } else if (signatureType === "02") {
    sighashType = "NONE";
  } else if (signatureType === "03") {
    sighashType = "SINGLE";
  } else if (signatureType === "81") {
    sighashType = "ALL";
    anyOneCanPayFlag = true;
  } else if (signatureType === "82") {
    sighashType = "NONE";
    anyOneCanPayFlag = true;
  } else if (signatureType === "83") {
    sighashType = "SINGLE";
    anyOneCanPayFlag = true;
  }
  const version = serializeUInt32LE(transaction.version);
  let vinLength;
  if (anyOneCanPayFlag) {
    vinLength = Buffer.from(serializeVarInt(1), "hex");
  } else {
    vinLength = Buffer.from(serializeVarInt(transaction.vin.length), "hex");
  }
  const inputs = Buffer.from(
    serializeInputs(transaction.vin, input, anyOneCanPayFlag),
    "hex"
  );
  const outputs = Buffer.from(serializeOutputs(transaction.vout), "hex");
  const locktime = serializeUInt32LE(transaction.locktime);
  return Buffer.concat([version, vinLength, inputs, outputs, locktime]);
}

// Function to serialize inputs
function serializeInputs(inputs, input, anyOneCanPayFlag) {
  if (anyOneCanPayFlag) {
    inputs = [input];
  }
  let serialized = "";
  for (let input of inputs) {
    serialized += Buffer.from(input.txid, "hex").reverse().toString("hex");
    serialized += serializeUInt32LE(input.vout).toString("hex");
    serialized += serializeVarInt(input.scriptsig.length / 2).toString("hex");
    serialized += input.scriptsig;
    serialized += serializeUInt32LE(input.sequence).toString("hex");
  }
  return serialized;
}

// Function to serialize outputs
function serializeOutputs(outputs) {
  let serialized = serializeVarInt(outputs.length).toString("hex");
  outputs.forEach((output) => {
    serialized += serializeUInt64LE(output.value).toString("hex");
    serialized += serializeVarInt(output.scriptpubkey.length / 2).toString(
      "hex"
    );
    serialized += output.scriptpubkey;
  });
  return serialized;
}
