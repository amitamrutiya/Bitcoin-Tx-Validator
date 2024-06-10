import { z } from "zod";

export const outputSchema = z.object({
  value: z.coerce.number().int().min(0, "Amount must be greater than 0"),
  scriptpubkey: z.optional(z.string()),
  scriptpubkey_address: z.string().min(2, "Address cannot be empty"),
  scriptpubkey_asm: z.string().min(2, "ScriptPubKey cannot be empty"),
  scriptpubkey_type: z
    .enum(
      [
        "Non-Standard",
        "unknown",
        "p2pk",
        "p2pkh",
        "p2ms",
        "p2sh",
        "v0_p2wpkh",
        "v0_p2wsh",
        "v1_p2tr",
        "op_return",
      ],
      {
        required_error: "You need to select a type of output",
      }
    )
    .refine((value) => value !== "Non-Standard", {
      message: "Output type cannot be Non-Standard",
    }),
});

export const inputSchema = z.object({
  txid: z
    .string()
    .length(64, "Txid must be exactly 64 characters long")
    .refine((value) => /^[0-9a-fA-F]+$/.test(value), {
      message: "Txid must be a valid hexadecimal string.",
    }),
  vout: z.coerce.number().int().min(0, "Vout must be greater than 0"),
  witness: z.optional(z.array(z.string().min(2, "witness cannot be empty"))),
  scriptsig: z.optional(z.string()),
  scriptsig_asm: z.optional(z.string()),
  sequence: z.coerce.number().int().min(0),
  is_coinbase: z.optional(z.boolean()),
  prevout: outputSchema,
  inner_redeemscript_asm: z.optional(
    z.string().min(2, "RedeemScript cannot be empty")
  ),
  inner_witnessscript_asm: z.optional(
    z.string().min(2, "WitnessScript cannot be empty")
  ),
});

export const transactionSchema = z.object({
  version: z.coerce.number().int().min(1).max(2),
  locktime: z.coerce.number().int().min(0),
  vin: z.array(inputSchema),
  vout: z.array(outputSchema),
  fee: z.optional(z.number()),
  weight: z.optional(z.number()),
  TxId: z.optional(
    z.string().length(64, "TxId must be exactly 64 characters long")
  ),
  wTxId: z.optional(
    z.string().length(64, "wTxId must be exactly 64 characters long")
  ),
});

export const merkleRootSchema = z.object({
  txids: z.array(
    z
      .string()
      .length(64, "Txid must be exactly 64 characters long")
      .refine(
        (txid) => /^[a-fA-F0-9]+$/.test(txid),
        "Txid must only contain hexadecimal characters"
      )
  ),
});

export const txidSchema = z.object({
  rawTransaction: z.string().min(50, {
    message: "transaction data must be at least 50 characters.",
  }),
});

export const scriptSchema = z.object({
  asm: z.string().min(1, "Script cannot be empty"),
});

export const addressSchema = z.object({
  prefix: z.enum(["00", "05", "6f", "c4"]),
  hash: z.string().min(1, "Hash cannot be empty"),
});

export const hashSchema = z.object({
  hash: z.string().min(1, "Hash cannot be empty"),
});

export const signatureSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  signature: z.string().min(1, "Signature cannot be empty"),
  publicKey: z.string().min(1, "Public key cannot be empty"),
});

export const parseDerSchema = z.object({
  signature: z.string().min(1, "Signature cannot be empty"),
});

export const reverseBytesSchema = z.object({
  bytes: z.string().min(1, "Bytes cannot be empty"),
});

export const littleIndianSchema = z.object({
  num: z.string().min(1, "Number cannot be empty"),
});

export const unixTimeSchema = z.object({
  unixTime: z.coerce.number().int().min(0),
});

export type TransactionInputSchema = z.infer<typeof inputSchema>;

export type TransactionOutputSchema = z.infer<typeof outputSchema>;

export type TransactionSchema = z.infer<typeof transactionSchema>;

export type MerkleRootSchema = z.infer<typeof merkleRootSchema>;

export type TxidSchema = z.infer<typeof txidSchema>;

export type ScriptSchema = z.infer<typeof scriptSchema>;

export type AddressSchema = z.infer<typeof addressSchema>;

export type HashSchema = z.infer<typeof hashSchema>;

export type SignatureSchema = z.infer<typeof signatureSchema>;

export type ReverseBytesSchema = z.infer<typeof reverseBytesSchema>;

export type LittleIndianSchema = z.infer<typeof littleIndianSchema>;

export type UnixTimeSchema = z.infer<typeof unixTimeSchema>;

export type ParseDerSchema = z.infer<typeof parseDerSchema>;

export const inputDefaultValues: TransactionInputSchema = {
  txid: "a".repeat(64),
  vout: 0,
  sequence: 4294967294,
  scriptsig_asm: "",
  is_coinbase: false,
  scriptsig: "",
  witness: [],
  prevout: {
    scriptpubkey_asm: "",
    // @ts-ignore
    scriptpubkey_type: "Non-Standard",
    value: 0,
    scriptpubkey: "",
    scriptpubkey_address: "",
  },
};

export const outputDefaultValues: TransactionOutputSchema = {
  value: 0,
  scriptpubkey_asm: "",
  // @ts-ignore
  scriptpubkey_type: "Non-Standard",
  scriptpubkey: "",
  scriptpubkey_address: "",
};

export const TransactionDefaultValues: TransactionSchema = {
  version: 1,
  vin: [inputDefaultValues],
  vout: [outputDefaultValues],
  locktime: 0,
};
