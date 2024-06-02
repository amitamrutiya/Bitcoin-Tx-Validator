"use server";

import { hash160, hash256, sha256, ripemd } from "@/service/utils";

export async function getHash256(data: string): Promise<string> {
  return hash256(data);
}

export async function getHash160(data: string): Promise<string> {
  return hash160(data);
}

export async function getSHA256(data: string): Promise<string> {
  return sha256(data);
}

export async function getRipemd160(data: string): Promise<string> {
  return ripemd(data);
}
