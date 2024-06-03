import {
  TransactionInputSchema,
  TransactionOutputSchema,
  TransactionSchema,
} from "@/utils/schema";
import {
  serializeUInt32LE,
  serializeUInt64LE,
  serializeVarInt,
  hash256Buffer,
  verifySignature,
} from "./utils";

export default function verifyLegacyTransaction(
  transaction: TransactionSchema,
  input: TransactionInputSchema,
  signatures: string[],
  publicKeys: string[]
): boolean {
  const serialized = serializeLegacyTransaction(transaction, input, signatures);
  let validCount = 0;
  for (const signature of signatures) {
    for (const publicKey of publicKeys) {
      const sighashType = Buffer.alloc(4);
      sighashType.writeUInt32LE(parseInt(signature.slice(-2), 16), 0);
      const serializedWithSighash = Buffer.concat([serialized, sighashType]);
      const hashResult = hash256Buffer(serializedWithSighash);
      const result = verifySignature(
        hashResult.toString("hex"),
        signature.slice(0, -2),
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

function serializeLegacyTransaction(
  transaction: TransactionSchema,
  input: TransactionInputSchema,
  signatures: string[]
): Buffer {
  const signatureType = signatures[0].slice(-2);
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

  const vinLength = Buffer.from(
    serializeVarInt(anyOneCanPayFlag ? 1 : transaction.vin.length).toString(
      "hex"
    ),
    "hex"
  );

  const inputs = Buffer.from(
    serializeInputs(transaction.vin, input, anyOneCanPayFlag),
    "hex"
  );
  const outputs = Buffer.from(serializeOutputs(transaction.vout), "hex");
  const locktime = serializeUInt32LE(transaction.locktime);

  return Buffer.concat([version, vinLength, inputs, outputs, locktime]);
}

// Function to serialize inputs
function serializeInputs(
  inputs: TransactionInputSchema[],
  input: TransactionInputSchema,
  anyOneCanPayFlag: boolean
): string {
  if (anyOneCanPayFlag) {
    inputs = [input];
  }
  let serialized = "";
  for (const input of inputs) {
    serialized += Buffer.from(input.txid, "hex").reverse().toString("hex");
    serialized += serializeUInt32LE(input.vout).toString("hex");
    serialized += serializeVarInt(input.scriptsig!.length / 2).toString("hex");
    serialized += input.scriptsig;
    serialized += serializeUInt32LE(input.sequence).toString("hex");
  }
  return serialized;
}

function serializeOutputs(outputs: TransactionOutputSchema[]): string {
  let serialized = serializeVarInt(outputs.length).toString("hex");
  outputs.forEach((output) => {
    serialized += serializeUInt64LE(output.value).toString("hex");
    serialized += serializeVarInt(output.scriptpubkey!.length / 2).toString(
      "hex"
    );
    serialized += output.scriptpubkey;
  });
  return serialized;
}
