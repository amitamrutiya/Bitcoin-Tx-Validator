"use server";

import { Transaction } from "@/types";

export async function mineTransaction(
  transactions: Transaction[]
): Promise<string> {
  console.log(transactions[0]);
  return "";
}
