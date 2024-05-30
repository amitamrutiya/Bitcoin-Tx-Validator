"use server";

import { asmToHex } from "@/service/asmHexConversion";
import { executeScript } from "@/service/scriptExecution";
import { serializeTransaction } from "@/service/serializeTransaction";
import { serializeWitnessTransaction } from "@/service/serializeWitnessTransaction";
import { calculateTxId } from "@/service/utils";
import { isValidAddresses } from "@/service/verifyAddress";
import { TransactionSchema } from "@/utils/schema";

export async function isTransactionValid(
  transaction: TransactionSchema
): Promise<{ isValid: boolean; seralizedTransaction: string }> {
  let fee = 0;
  if (!transaction) return { isValid: false, seralizedTransaction: "" };
  let isSegwit = false;

  isSegwit = transaction.vin.some((tx) => tx.witness !== undefined);

  transaction.vin.forEach((input) => {
    input.prevout.scriptpubkey = asmToHex(input.prevout.scriptpubkey_asm);
  });

  transaction.vout.forEach((output) => {
    output.scriptpubkey = asmToHex(output.scriptpubkey_asm);
  });

  const isValidAddress = isValidAddresses(transaction);
  if (!isValidAddress) {
    console.log("Invalid Address");
    return { isValid: false, seralizedTransaction: "" };
  }
  console.log("Valid Address");
  // Transaction ID Validation
  const serializedTransaction = serializeTransaction(transaction);
  const TxId = calculateTxId(serializedTransaction);
  const serializedWitnessTransaction = serializeWitnessTransaction(transaction);
  const wTxId = calculateTxId(serializedWitnessTransaction);

  transaction.TxId = TxId.toString("hex");
  transaction.wTxId = wTxId.toString("hex");

  // Script and Signature Validation
  const result = executeScript(transaction);
  if (!result) {
    console.log("Script and Signature Validation failed");
    return { isValid: false, seralizedTransaction: "" };
  }

  // Output Validation
  const inputTotal = transaction.vin.reduce(
    (total, input) => total + input.prevout.value,
    0
  );
  const outputTotal = transaction.vout.reduce(
    (total, output) => total + output.value,
    0
  );
  if (outputTotal > inputTotal) {
    console.log("Output total exceeds input total");
    return { isValid: false, seralizedTransaction: "" };
  }
  fee = inputTotal - outputTotal;
  transaction.fee = fee;

  return {
    isValid: true,
    seralizedTransaction: isSegwit
      ? serializedWitnessTransaction
      : serializedTransaction,
  };
}
