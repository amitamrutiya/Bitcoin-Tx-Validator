"use server";

import { asmToHex } from "@/service/asmHexConversion";

export async function getHexFromAsm(asm: string): Promise<{ hex: string }> {
  const data = asmToHex(asm);
  return { hex: data };
}
