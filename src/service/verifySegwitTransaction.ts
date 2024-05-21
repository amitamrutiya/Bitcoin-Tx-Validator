import { Transaction, TransactionInput } from "../types";
import {
  hash256Buffer,
  serializeUInt32LE,
  serializeUInt64LE,
  verifySignature,
  serializeVarInt,
} from "./utils";

export default function verifySegwitTransaction(
  transaction: Transaction,
  input: TransactionInput,
  signatures: string[],
  publicKeys: string[]
): boolean {
  const serialized = serializeSegwitTransaction(transaction, input);
  let validCount = 0;
  for (const signature of signatures) {
    for (const publicKey of publicKeys) {
      const sighashType = Buffer.alloc(4);
      sighashType.writeUInt32LE(parseInt(signature.slice(-2), 16), 0);
      const serializedWithSighash = Buffer.concat([serialized, sighashType]);
      const hashResult = hash256Buffer(serializedWithSighash);
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

function serializeSegwitTransaction(
  transaction: Transaction,
  input: TransactionInput
): Buffer {
  const inputIndex = transaction.vin.findIndex(
    (vin) => vin.txid === input.txid
  );
  const signatureType = input.witness![0].slice(-2);
  let sighashType;
  let anyOneCanPayFlag = false;
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
  const hashPrevout = hashPrevouts(transaction, anyOneCanPayFlag);
  const hashSequences = hashSequence(transaction, input, anyOneCanPayFlag);
  const outpoint = serializeOutpoint(input);
  const scriptCode = serializeScriptCode(input);
  const value = serializeUInt64LE(input.prevout.value);
  const nSequence = serializeUInt32LE(input.sequence);
  const hashOutput = hashOutputs(
    transaction,
    sighashType!,
    inputIndex,
    anyOneCanPayFlag
  );
  const nLocktime = serializeUInt32LE(transaction.locktime);
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
  ]);
}

function serializeOutpoint(input: TransactionInput): Buffer {
  const txid = Buffer.from(input.txid, "hex").reverse();
  const vout = serializeUInt32LE(input.vout);
  return Buffer.concat([txid, vout]);
}

function serializeScriptCode(input: TransactionInput): Buffer {
  if (
    input.prevout.scriptpubkey_type === "p2sh" &&
    input.witness !== undefined &&
    input.scriptsig !== "" &&
    input.witness.length > 2
  ) {
    const scriptPubKey = input.witness[input.witness.length - 1];

    return Buffer.concat([
      // @ts-ignore
      serializeVarInt(scriptPubKey.length / 2),
      Buffer.from(scriptPubKey, "hex"),
    ]);
  }
  const scriptPubKey = input.scriptsig.slice(4);
  return Buffer.concat([
    Buffer.from("1976a914", "hex"),
    Buffer.from(scriptPubKey, "hex"),
    Buffer.from("88ac", "hex"),
  ]);
}

function hashPrevouts(transaction: any, anyOneCanPayFlag: boolean): Buffer {
  if (transaction.vin[0].is_coinbase || anyOneCanPayFlag) {
    return Buffer.alloc(32);
  } else {
    const outpoints = transaction.vin.map((input: any) =>
      serializeOutpoint(input)
    );
    const buffer = Buffer.concat(outpoints);
    return hash256Buffer(buffer);
  }
}

function hashSequence(
  transaction: Transaction,
  input: TransactionInput,
  anyOneCanPayFlag: boolean
): Buffer {
  if (anyOneCanPayFlag) {
    return Buffer.alloc(32);
  }
  const sequences = transaction.vin.map((input) =>
    serializeUInt32LE(input.sequence)
  );
  const buffer = Buffer.concat(sequences);
  return hash256Buffer(buffer);
}

function hashOutputs(
  transaction: Transaction,
  sighashType: string,
  inputIndex: number,
  anyOneCanPayFlag: boolean
): Buffer {
  let outputs;
  if (sighashType === "SINGLE" && inputIndex < transaction.vout.length) {
    const output = transaction.vout[inputIndex];
    const value = serializeUInt64LE(output.value);
    const scriptPubKeySize = Buffer.alloc(1);
    scriptPubKeySize.writeUInt8(output.scriptpubkey.length / 2);
    const scriptPubKey = Buffer.from(output.scriptpubkey, "hex");
    outputs = [Buffer.concat([value, scriptPubKeySize, scriptPubKey])];
  } else if (sighashType !== "SINGLE" && sighashType !== "NONE") {
    outputs = transaction.vout.map((output) => {
      const value = serializeUInt64LE(output.value);
      const scriptPubKeySize = Buffer.alloc(1);
      scriptPubKeySize.writeUInt8(output.scriptpubkey.length / 2);
      const scriptPubKey = Buffer.from(output.scriptpubkey, "hex");
      return Buffer.concat([value, scriptPubKeySize, scriptPubKey]);
    });
  } else {
    return Buffer.alloc(32);
  }
  const buffer = Buffer.concat(outputs);
  return hash256Buffer(buffer);
}
