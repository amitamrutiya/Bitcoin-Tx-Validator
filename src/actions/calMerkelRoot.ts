"use server";

import { createMerkleRoot } from "@/service/utils";

export async function getMerkeRoot(txids: string[]): Promise<string | null> {
  return createMerkleRoot(txids);
}
