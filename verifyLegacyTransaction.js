import {
  serializeUInt32LE,
  serializeVarInt,
  serializeValue,
  sha256Double,
  verifySignature,
} from "./utils.js";

const SIGHASH_ALL = "01000000";

export default function verifyLegacyTransaction(
  transaction,
  input,
  signatures,
  publicKeys
) {
  const serialized = serializeLegacyTransaction(transaction);
  const hashResult = sha256Double(serialized);
  const scriptsig_asm = input.scriptsig_asm.split(" ");
  if (input.prevout.scriptpubkey_type === "p2sh") {
    for (let i = 0; i < scriptsig_asm.length; i++) {
      if (scriptsig_asm[i] === "OP_PUSHBYTES_71") {
        signatures.push(scriptsig_asm[i + 1]);
      }
    }
    const inner_redeemscript_asm = input.inner_redeemscript_asm.split(" ");
    for (let i = 0; i < inner_redeemscript_asm.length; i++) {
      if (
        inner_redeemscript_asm[i] === "OP_PUSHBYTES_33" ||
        inner_redeemscript_asm[i] === "OP_PUSHBYTES_65"
      ) {
        publicKeys.push(inner_redeemscript_asm[i + 1]);
      }
    }
  }
  let validCount = 0;
  for (let signature of signatures) {
    for (let publicKey of publicKeys) {
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

function serializeLegacyTransaction(transaction) {
  const version = serializeUInt32LE(transaction.version);
  const vinLength = serializeVarInt(transaction.vin.length);
  const inputs = Buffer.from(serializeInputs(transaction.vin), "hex");
  const outputs = Buffer.from(serializeOutputs(transaction.vout), "hex");
  const locktime = serializeUInt32LE(transaction.locktime);
  const sighashType = Buffer.alloc(4);
  sighashType.writeUInt32LE(1, 0);
  return Buffer.concat([
    version,
    vinLength,
    inputs,
    outputs,
    locktime,
    sighashType,
  ]);
}

function serializeInputs(inputs) {
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

function serializeOutputs(outputs) {
  let serialized = serializeVarInt(outputs.length).toString("hex");
  outputs.forEach((output) => {
    serialized += serializeValue(output.value).toString("hex");
    serialized += serializeVarInt(output.scriptpubkey.length / 2).toString(
      "hex"
    );
    serialized += output.scriptpubkey;
  });
  return serialized;
}
