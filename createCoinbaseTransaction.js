import { serializeUInt64LE } from "./utils.js";

export function createCoinbaseTransaction(amount) {
  const coinbaseTransaction = {};
  coinbaseTransaction.version = 1;
  coinbaseTransaction.locktime = 0;
  coinbaseTransaction.vin = [
    {
      txid: "0000000000000000000000000000000000000000000000000000000000000000",
      vout: "ffffffff",
      scriptsig: "04233fa04e028b12",
      sequence: "ffffffff",
    },
  ];
  coinbaseTransaction.vout = [
    {
      value: amount,
      scriptpubkey: "76a914010966776006953d5567439e5e39f86a0d273bee88ac",
    },
  ];

  return coinbaseTransaction;
}
