"use server";

import { Block } from "@/utils/types";
import { createBlockHeader } from "@/service/createBlockHeader";
import { createCoinbaseTransaction } from "@/service/createCoinbaseTransaction";
import { selectTransaction } from "@/service/selectTransaction";
import { serializeTransaction } from "@/service/serializeTransaction";
import { serializeWitnessTransaction } from "@/service/serializeWitnessTransaction";
import { serializeVarInt, calculateTxId } from "@/service/utils";
import { TransactionSchema } from "@/utils/schema";
import { isTransactionValid } from "./isTransactionValid";

export async function mineTransaction(
  transactions: TransactionSchema[]
): Promise<Block> {
  transactions.forEach(async (transaction) => {
    const isValid = await isTransactionValid(transaction);

    if (!isValid) {
      console.log("Transaction is not valid");
      return;
    }
  });
  type MyType = {
    selectedTransaction: TransactionSchema[];
    totalFee: number;
  };
  // Sort transactions by fee and size
  const { selectedTransaction, totalFee }: MyType =
    selectTransaction(transactions);
  const transactionNumber = serializeVarInt(selectedTransaction.length);

  // Create Coinbase Transaction
  const coinbaseTx = createCoinbaseTransaction(totalFee, selectedTransaction);
  const serializedCoinbaseTx = serializeTransaction(coinbaseTx);
  const serializedWitnessCoinbaseTx = serializeWitnessTransaction(coinbaseTx);
  const coinbaseTxId = calculateTxId(serializedCoinbaseTx);
  const coinbaseWTxId = calculateTxId(serializedWitnessCoinbaseTx);
  coinbaseTx.TxId = coinbaseTxId.toString("hex");
  coinbaseTx.wTxId = coinbaseWTxId.toString("hex");
  selectedTransaction.unshift(coinbaseTx);

  // Create Block Header
  const blockHeader = createBlockHeader(selectedTransaction);
  const transactionsTxIds = selectedTransaction.map(
    (tx: TransactionSchema) => tx.TxId!
  );

  const data = `${blockHeader}
${serializedWitnessCoinbaseTx}
${transactionsTxIds.join("\n")}
`;
  const transactionNumberBuffer = Buffer.isBuffer(transactionNumber)
    ? transactionNumber
    : Buffer.from(transactionNumber);

  const block = new Block(
    blockHeader,
    transactionNumberBuffer,
    serializedWitnessCoinbaseTx,
    transactionsTxIds
  );
  return JSON.parse(JSON.stringify(block));
}
