"use server";

import { executeScript } from "@/service/scriptExecution";
import { serializeTransaction } from "@/service/serializeTransaction";
import { serializeWitnessTransaction } from "@/service/serializeWitnessTransaction";
import { calculateTxId } from "@/service/utils";
import { isValidAddresses } from "@/service/verifyAddress";
import { TransactionSchema } from "@/utils/schema";
import { Transaction } from "@/utils/types";

export async function isTransactionValid(
  transaction: TransactionSchema
): Promise<boolean> {
  let fee = 0;
  if (!transaction) return false;

  const isValidAddress = isValidAddresses(transaction);
  if (!isValidAddress) {
    console.log("Invalid Address");
    return false;
  }

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
    return false;
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
    return false; // Output total exceeds input total
  }
  fee = inputTotal - outputTotal;
  transaction.fee = fee;

  return true;
}
