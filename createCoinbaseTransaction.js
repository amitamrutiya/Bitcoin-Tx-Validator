export function createCoinbaseTransaction(amount) {
  const coinbaseTransaction = {};
  coinbaseTransaction.version = 1;
  coinbaseTransaction.locktime = 0;
  coinbaseTransaction.vin = [
    {
      txid: "0000000000000000000000000000000000000000000000000000000000000000",
      vout: "ffffffff",
      scriptsig:
        "03000000184d696e656420627920416e74506f6f6c373946205b8160a4256c0000946e0100",
      sequence: "ffffffff",
    },
  ];
  coinbaseTransaction.vout = [
    {
      value: amount,
      scriptpubkey: "76a914edf10a7fac6b32e24daa5305c723f3de58db1bc888ac",
    },
  ];
  coinbaseTransaction.witness = [
    "0000000000000000000000000000000000000000000000000000000000000000",
  ];
  coinbaseTransaction.marker = "00";
  coinbaseTransaction.flag = "01";

  return coinbaseTransaction;
}
