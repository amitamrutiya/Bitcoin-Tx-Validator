import {
  sha256Double,
  serializeUInt32LE,
  serializeValue,
  verifySignature,
} from "./utils.js";

export default function verifySegwitTransaction(
  transaction,
  input,
  signature,
  publicKey
) {
  const serializedTx = serializeSegwitTransaction(transaction, input);
  const doubleSHA256Final = sha256Double(serializedTx);
  let signatures = [];
  let publicKeys = [];

  const witness = input.witness;
  // for (let i = 0; i < witness.length - 1; i++) {
  //   if (witness[i] !== '' ) {
  //     signatures.push(witness[i]);
  //   }
  // }

  // const inner_witnessscript_asm = input.inner_witnessscript_asm.split(" ");
  // for (let i = 0; i < inner_witnessscript_asm.length; i++) {
  //   if (
  //     inner_witnessscript_asm[i] === "OP_PUSHBYTES_33" ||
  //     inner_witnessscript_asm[i] === "OP_PUSHBYTES_65"
  //   ) {
  //     publicKeys.push(inner_witnessscript_asm[i + 1]);
  //   }
  // }

  signatures.push(witness[0]);
  publicKeys.push(witness[1]);

  let validCount = 0;
  for (let signature of signatures) {
    for (let publicKey of publicKeys) {
      const result = verifySignature(
        doubleSHA256Final.toString("hex"),
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

function serializeSegwitTransaction(transaction, input) {
  const version = serializeUInt32LE(transaction.version);
  const hashPrevout = hashPrevouts(transaction);
  const hashSequences = hashSequence(transaction, input);
  const outpoint = serializeOutpoint(input);
  const scriptCode = serializeScriptCode(input);
  const value = serializeValue(input.prevout.value);
  const nSequence = serializeUInt32LE(input.sequence);
  const hashOutput = hashOutputs(transaction);
  const nLocktime = serializeUInt32LE(transaction.locktime);
  const sighashType = Buffer.alloc(4);
  sighashType.writeUInt32LE(1, 0);
  return Buffer.concat([
    version,
    hashPrevout,
    hashSequences,
    outpoint,
    scriptCode,
    value,
    nSequence,
    hashOutput,
    nLocktime,
    sighashType,
  ]);
}

function serializeOutpoint(input) {
  const txid = Buffer.from(input.txid, "hex").reverse();
  const vout = serializeUInt32LE(input.vout);
  return Buffer.concat([txid, vout]);
}

function serializeScriptCode(input) {
  const scriptPubKey = input.scriptsig.slice(4);
  return Buffer.concat([
    Buffer.from("1976a914", "hex"),
    Buffer.from(scriptPubKey, "hex"),
    Buffer.from("88ac", "hex"),
  ]);
}

function hashPrevouts(transaction) {
  if (transaction.vin[0].is_coinbase) {
    return Buffer.alloc(32);
  } else {
    const outpoints = transaction.vin.map((input) => serializeOutpoint(input));
    const buffer = Buffer.concat(outpoints);
    return sha256Double(buffer);
  }
}

function hashSequence(transaction, input) {
  if (input.is_coinbase || input.prevout.scriptpubkey_type === "v0_p2wsh") {
    return Buffer.alloc(32);
  } else {
    const sequences = transaction.vin.map((input) =>
      serializeUInt32LE(input.sequence)
    );
    const buffer = Buffer.concat(sequences);
    return sha256Double(buffer);
  }
}

function hashOutputs(transaction) {
  const outputs = transaction.vout.map((output) => {
    const value = serializeValue(output.value);
    const scriptPubKeySize = Buffer.alloc(1);
    scriptPubKeySize.writeUInt8(output.scriptpubkey.length / 2);
    const scriptPubKey = Buffer.from(output.scriptpubkey, "hex");
    return Buffer.concat([value, scriptPubKeySize, scriptPubKey]);
  });
  const buffer = Buffer.concat(outputs);
  return sha256Double(buffer);
}
