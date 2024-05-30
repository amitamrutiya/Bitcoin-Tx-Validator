const opcodeMap: { [key: string]: string } = {
  // Constants
  OP_0: "00",
  OP_FALSE: "00",
  OP_1: "51",
  OP_TRUE: "51",
  OP_2: "52",
  OP_3: "53",
  OP_4: "54",
  OP_5: "55",
  OP_6: "56",
  OP_7: "57",
  OP_8: "58",
  OP_9: "59",
  OP_10: "5a",
  OP_11: "5b",
  OP_12: "5c",
  OP_13: "5d",
  OP_14: "5e",
  OP_15: "5f",
  OP_16: "60",
  OP_PUSHNUM_1: "51",
  OP_PUSHNUM_2: "52",
  OP_PUSHNUM_3: "53",
  OP_PUSHNUM_4: "54",
  OP_PUSHNUM_5: "55",
  OP_PUSHNUM_6: "56",
  OP_PUSHNUM_7: "57",
  OP_PUSHNUM_8: "58",
  OP_PUSHNUM_9: "59",
  // Flow control
  OP_NOP: "61",
  OP_IF: "63",
  OP_NOTIF: "64",
  OP_ELSE: "67",
  OP_ENDIF: "68",
  OP_VERIFY: "69",
  OP_RETURN: "6a",
  // Stack
  OP_DROP: "75",
  OP_DUP: "76",
  OP_HASH160: "a9",
  OP_AND: "84",
  OP_OR: "85",
  OP_EQUAL: "87",
  OP_EQUALVERIFY: "88",
  OP_CHECKSIG: "ac",
  //Arithmetic
  OP_ADD: "93",
  OP_SUB: "94",
  OP_MUL: "95",
  OP_DIV: "96",
  OP_MOD: "97",
  OP_LSHIFT: "98",
  OP_RSHIFT: "99",
  OP_BOOLAND: "9a",
  OP_BOOLOR: "9b",
  OP_NUMEQUAL: "9c",
  OP_NUMEQUALVERIFY: "9d",
  OP_NUMNOTEQUAL: "9e",
  OP_LESSTHAN: "9f",
  OP_GREATERTHAN: "a0",
  OP_LESSTHANOREQUAL: "a1",
  OP_GREATERTHANOREQUAL: "a2",
  OP_MIN: "a3",
  OP_MAX: "a4",
  OP_WITHIN: "a5",
  // Cryptography
  OP_RIPEMD160: "a6",
  OP_SHA1: "a7",
  OP_SHA256: "a8",
  OP_CHECKMULTISIG: "ae",
  OP_CHECKMULTISIGVERIFY: "af",
  OP_CHECKLOCKTIMEVERIFY: "b1",
  OP_CHECKSEQUENCEVERIFY: "b2",

  OP_PUSHBYTES_20: "14",
  OP_PUSHBYTES_32: "20",
  OP_PUSHBYTES_33: "21",
  OP_PUSHBYTES_65: "41",
  OP_PUSHBYTES_71: "47",
  OP_PUSHBYTES_72: "48",
  OP_PUSHDATA1: "4c",
  OP_PUSHDATA2: "4d",
  OP_PUSHDATA4: "4e",
  OP_1NEGATE: "4f",
};

export function asmToHex(scriptpubkey_asm: string): string {
  const parts = scriptpubkey_asm.split(" ");
  let hexString = "";

  for (const part of parts) {
    if (part.startsWith("OP_")) {
      if (opcodeMap[part] !== undefined) {
        hexString += opcodeMap[part];
      } else {
        throw new Error(`Unsupported opcode: ${part}`);
      }
    } else if (/^[0-9a-fA-F]+$/.test(part)) {
      const length = (part.length / 2).toString(16).padStart(2, "0");
      hexString += length + part;
    } else {
      throw new Error(`Invalid script part: ${part}`);
    }
  }

  return hexString;
}
