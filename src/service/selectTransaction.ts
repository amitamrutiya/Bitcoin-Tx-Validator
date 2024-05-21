import { Transaction } from "../types";

export function selectTransaction(transactions: Transaction[]): Transaction[] {
  let finalTransactions: Transaction[] = [];
  const maxFee = 20616923;
  const maxWeight = 3990000;
  let fee = 0;
  let weight = 0;

  // First pass: select transactions based on the highest fee-to-weight ratio
  transactions.sort((a, b) => {
    const ratioA = a.fee / a.weight;
    const ratioB = b.fee / b.weight;
    return ratioB - ratioA;
  });

  for (let transaction of transactions) {
    if (weight + transaction.weight <= maxWeight) {
      finalTransactions.push(transaction);
      fee += transaction.fee;
      weight += transaction.weight;
    }
  }

  // Second pass: select transactions based on the highest fee
  transactions.sort((a, b) => b.fee - a.fee);

  for (let transaction of transactions) {
    if (
      !finalTransactions.includes(transaction) &&
      fee + transaction.fee <= maxFee &&
      weight + transaction.weight <= maxWeight // Check if adding this transaction would exceed the maxWeight
    ) {
      finalTransactions.push(transaction);
      fee += transaction.fee;
      weight += transaction.weight;
    }
  }

  console.log("fee: ", fee);
  console.log("weight: ", weight);
  return finalTransactions;
}
