import { z } from "zod";

export const inputSchema = z.object({
  txid: z
    .string()
    .length(64, "Txid must be exactly 64 characters long")
    .refine((value) => /^[0-9a-fA-F]+$/.test(value), {
      message: "Txid must be a valid hexadecimal string.",
    }),
  witness: z.string().min(2, "ScriptSig cannot be empty"),
  vout: z.coerce.number().int().min(1, "Vout must be greater than 0"),
  scriptSig: z.string().min(2, "ScriptSig cannot be empty"),
  sequence: z.coerce.number().int().min(0),
  prevout: z.object({
    outputType: z
      .enum(
        [
          "Non-Standard",
          "P2PK",
          "P2PKH",
          "P2MS",
          "P2SH",
          "P2WPKH",
          "P2WPSH",
          "P2TR",
        ],
        {
          required_error: "You need to select a type of output",
        }
      )
      .refine((value) => value !== "Non-Standard", {
        message: "Output type cannot be Non-Standard",
      }),
    scriptPubKey: z.string().min(2, "ScriptPubKey cannot be empty"),
    amount: z.coerce.number().int().min(1, "Value must be greater than 0"),
  }),
});

export const outputSchema = z.object({
  amount: z.coerce.number().int().min(1, "Amount must be greater than 0"),
  scriptPubKey: z.string().min(2, "ScriptPubKey cannot be empty"),
  outputType: z
    .enum(
      [
        "Non-Standard",
        "P2PK",
        "P2PKH",
        "P2MS",
        "P2SH",
        "P2WPKH",
        "P2WPSH",
        "P2TR",
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
  type: z.enum(["Legacy", "Segwit"]),
  version: z.coerce.number().int().min(1).max(2),
  locktime: z.coerce.number().int().min(0),
  marker: z.string().min(2),
  flag: z.string().min(2),
  inputs: z.array(inputSchema),
  outputs: z.array(outputSchema),
});

export type InputSchema = z.infer<typeof inputSchema>;

export type OutputSchema = z.infer<typeof outputSchema>;

export type TransactionSchema = z.infer<typeof transactionSchema>;

export const inputDefaultValues: InputSchema = {
  txid: "a".repeat(64),
  vout: 0,
  scriptSig: "",
  sequence: 4294967294,
  witness: "",
  prevout: {
    // @ts-ignore
    outputType: "Non-Standard",
    scriptPubKey: "",
    amount: 0,
  },
};

export const outputDefaultValues: OutputSchema = {
  amount: 0,
  scriptPubKey: "",
  // @ts-ignore
  outputType: "Non-Standard" as
    | "Non-Standard"
    | "P2PK"
    | "P2PKH"
    | "P2MS"
    | "P2SH"
    | "P2WPKH"
    | "P2WPSH"
    | "P2TR",
};

export const TransactionDefaultValues: TransactionSchema = {
  type: "Legacy",
  version: 1,
  inputs: [inputDefaultValues],
  outputs: [outputDefaultValues],
  locktime: 0,
  marker: "00",
  flag: "01",
};
