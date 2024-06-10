"use server";

import connectDB from "@/lib/db";
import TransactionModel from "@/model/transaction.model";

export async function getRandomTransaction() {
  await connectDB();

  const transaction = await TransactionModel.aggregate([
    { $sample: { size: 1 } },
  ]);
  return JSON.parse(JSON.stringify(transaction[0]));
}
