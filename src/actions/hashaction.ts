"use server";

import {  hash160, hash256 } from "@/service/utils";

export async function getHash256(data: string): Promise<string> {
  return hash256(data);
}

export async function getHash160(data: string): Promise<string> {
  return hash160(data);
}
