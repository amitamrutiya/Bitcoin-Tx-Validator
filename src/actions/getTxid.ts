"use server";

import { calculateTxId } from "@/service/utils";

export default async function getTxid(
  rawTransaction: string
): Promise<{ txid: string } | null> {
  const txid = calculateTxId(rawTransaction);
  return { txid: txid.toString("hex") };
}
