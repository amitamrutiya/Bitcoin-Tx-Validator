import mongoose from "mongoose";

const outputSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true, min: 0 },
    scriptpubkey: { type: String, required: false },
    scriptpubkey_address: { type: String, required: false, minlength: 2 },
    scriptpubkey_asm: { type: String, required: true, minlength: 2 },
    scriptpubkey_type: {
      type: String,
      required: true,
      enum: [
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
    },
  },
  {
    _id: false,
  }
);

const inputSchema = new mongoose.Schema(
  {
    txid: { type: String, required: true, minlength: 64, maxlength: 64 },
    vout: { type: Number, required: true, min: 0 },
    witness: { type: [String], required: false },
    scriptsig: { type: String, required: false },
    scriptsig_asm: { type: String, required: false },
    sequence: { type: Number, required: true, min: 0 },
    is_coinbase: { type: Boolean, required: false },
    prevout: outputSchema,
    inner_redeemscript_asm: { type: String, required: false, minlength: 2 },
    inner_witnessscript_asm: { type: String, required: false, minlength: 2 },
  },
  {
    _id: false,
  }
);

const transactionSchema = new mongoose.Schema({
  version: { type: Number, required: true, min: 1, max: 2 },
  locktime: { type: Number, required: true, min: 0 },
  vin: { type: [inputSchema], required: true },
  vout: { type: [outputSchema], required: true },
  fee: { type: Number, required: false },
  weight: { type: Number, required: false },
  TxId: { type: String, required: false, minlength: 64, maxlength: 64 },
  wTxId: { type: String, required: false, minlength: 64, maxlength: 64 },
});

const TransactionModel =
  mongoose.models.transactions ||
  mongoose.model("transactions", transactionSchema);

export default TransactionModel;
