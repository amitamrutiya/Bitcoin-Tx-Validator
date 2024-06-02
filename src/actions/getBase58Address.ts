"use server";

import { generateLegacyAddress } from "@/service/verifyAddress";

export async function getBase58Address({
  prefix,
  hash,
}: {
  prefix: number;
  hash: string;
}) {
  console.log(prefix, hash);
  const address = generateLegacyAddress(hash, prefix);
  console.log(address);
  return { address };
}
