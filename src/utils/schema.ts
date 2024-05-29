import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["Legacy", "Segwit"], {
    required_error: "You need to select a one type of transaction",
  }),
  version: z
    .number()
    .int()
    .min(1)
    .max(2)
    .refine((value) => value >= 1 && value <= 2, {
      message: "Version numbers greater than 2 are not yet in use.",
    }),
  locktime: z.number().int().min(0),
  marker: z.string().min(2),
  flag: z.string().min(2),
});

export const inputSchema = z.object({
  txid: z
    .string()
    .min(64)
    .max(64)
    .refine((value) => /^[0-9a-fA-F]+$/.test(value), {
      message: "Txid must be a valid hexadecimal string.",
    }),
  witness: z.string(),
  vout: z.number().int().min(0),
  scriptSig: z.string().min(2),
  sequence: z.number().int().min(0),
});

export const outputSchema = z.object({
  amount: z.number().int().min(0),
  scriptPubKey: z.string().min(2),
  outputType: z.enum(
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
      required_error: "You need to select a one type of output",
    }
  ),
});

export const fullTransactionSchema = z.intersection(
  transactionSchema,
  z.object({
    inputs: z.array(inputSchema),
    outputs: z.array(outputSchema),
  })
);

export type InputSchema = z.infer<typeof inputSchema>;

export type OutputSchema = z.infer<typeof outputSchema>;

export type TransactionSchema = z.infer<typeof fullTransactionSchema>;

export const inputDefaultValues: InputSchema = {
  txid: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  vout: 0,
  scriptSig: "",
  sequence: 4294967294,
  witness: "",
};

export const outputDefaultValues: OutputSchema = {
  amount: 0,
  scriptPubKey: "",
  outputType: "Non-Standard",
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
