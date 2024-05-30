import { TransactionSchema } from "@/utils/schema";

type MyType = {
  selectedTransaction: TransactionSchema[];
  totalFee: number;
};

export function selectTransaction(transactions: TransactionSchema[]): MyType {
  let selectedTransaction: TransactionSchema[] = [];
  const maxFee = 25000000;
  const maxWeight = 4000000;
  let totalFee = 0;
  let weight = 0;

  // First pass: select transactions based on the highest fee-to-weight ratio
  transactions.sort((a: TransactionSchema, b: TransactionSchema) => {
    const ratioA = a.fee! / a.weight!;
    const ratioB = b.fee! / b.weight!;
    return ratioB - ratioA;
  });

  for (let transaction of transactions) {
    if (weight + transaction.weight! <= maxWeight) {
      selectedTransaction.push(transaction);
      totalFee += transaction.fee!;
      weight += transaction.weight!;
    }
  }

  // Second pass: select transactions based on the highest fee
  transactions.sort((a, b) => b.fee! - a.fee!);

  for (let transaction of transactions) {
    if (
      !selectedTransaction.includes(transaction) &&
      totalFee + transaction.fee! <= maxFee &&
      weight + transaction.weight! <= maxWeight
    ) {
      selectedTransaction.push(transaction);
      totalFee += transaction.fee!;
      weight += transaction.weight!;
    }
  }
  return { selectedTransaction, totalFee };
}
