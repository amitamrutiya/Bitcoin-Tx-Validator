export function selectTransaction(transactions) {
  transactions.sort((a, b) => {
    const ratioA = a.fee / a.weight;
    const ratioB = b.fee / b.weight;
    return ratioB - ratioA;
  });

  let finalTransactions = [];
  const maxFee = 20616923;
  const maxWeight = 3999000;
  let fee = 0;
  let weight = 0;

  for (let transaction of transactions) {
    if (weight + transaction.weight <= maxWeight && fee + transaction.fee <= maxFee) {
      finalTransactions.push(transaction);
      fee += transaction.fee;
      weight += transaction.weight;
    }
  }
  return finalTransactions;
}
