import { z } from "zod";

export const inputSchema = z.object({
  txid: z
    .string()
    .length(64, "Txid must be exactly 64 characters long")
    .refine((value) => /^[0-9a-fA-F]+$/.test(value), {
      message: "Txid must be a valid hexadecimal string.",
    }),
  vout: z.coerce.number().int().min(1, "Vout must be greater than 0"),
  witness: z.optional(z.array(z.string().min(2, "witness cannot be empty"))),
  scriptsig: z.optional(z.string()),
  scriptsig_asm: z.string().min(2, "ScriptSig cannot be empty"),
  sequence: z.coerce.number().int().min(0),
  is_coinbase: z.optional(z.boolean()),
  prevout: z.object({
    scriptpubkey_type: z
      .enum(
        [
          "Non-Standard",
          "p2pk",
          "p2pkh",
          "p2ms",
          "p2sh",
          "p2wpkh",
          "p2wpsh",
          "p2tr",
        ],
        {
          required_error: "You need to select a type of output",
        }
      )
      .refine((value) => value !== "Non-Standard", {
        message: "Output type cannot be Non-Standard",
      }),
    scriptpubkey_asm: z.string().min(2, "ScriptPubKey cannot be empty"),
    value: z.coerce.number().int().min(1, "Value must be greater than 0"),
    scriptpubkey: z.optional(z.string()),
    scriptpubkey_address: z.optional(z.string()),
  }),

  inner_redeemscript_asm: z.optional(
    z.string().min(2, "RedeemScript cannot be empty")
  ),
  inner_witness_script_asm: z.optional(
    z.string().min(2, "WitnessScript cannot be empty")
  ),
});

export const outputSchema = z.object({
  value: z.coerce.number().int().min(1, "Amount must be greater than 0"),
  scriptpubkey: z.optional(z.string()),
  scriptpubkey_address: z.optional(z.string()),
  scriptpubkey_asm: z.string().min(2, "ScriptPubKey cannot be empty"),
  scriptpubkey_type: z
    .enum(
      [
        "Non-Standard",
        "p2pk",
        "p2pkh",
        "p2ms",
        "p2sh",
        "p2wpkh",
        "p2wpsh",
        "p2tr",
      ],
      {
        required_error: "You need to select a type of output",
      }
    )
    .refine((value) => value !== "Non-Standard", {
      message: "Output type cannot be Non-Standard",
    }),
});

export const transactionSchema = z.object({
  version: z.coerce.number().int().min(1).max(2),
  locktime: z.coerce.number().int().min(0),
  vin: z.array(inputSchema),
  vout: z.array(outputSchema),
});

export type InputSchema = z.infer<typeof inputSchema>;

export type OutputSchema = z.infer<typeof outputSchema>;

export type TransactionSchema = z.infer<typeof transactionSchema>;

export const inputDefaultValues: InputSchema = {
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
    amount: 0,
  },
};

export const outputDefaultValues: OutputSchema = {
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
