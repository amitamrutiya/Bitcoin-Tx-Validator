import { toLittleEndian, serializeVarInt } from "./utils.js";

export function serializeWitnessTransaction(tx) {
  let version = toLittleEndian(tx.version.toString(16).padStart(8, "0"));
  const isSegwit = tx.vin.some((input) => input.witness !== undefined);
  let marker = "";
  let flag = "";
  if (tx.vin.some((input) => input.witness !== undefined)) {
    marker = "00";
    flag = "01";
  }
  let locktime = toLittleEndian(tx.locktime.toString(16).padStart(8, "0"));
  let vinCount = serializeVarInt(tx.vin.length).toString("hex");
  let voutCount = serializeVarInt(tx.vout.length).toString("hex");

  let vin = tx.vin
    .map((input) => {
      let txid = toLittleEndian(input.txid);
      let vout = toLittleEndian(input.vout.toString(16).padStart(8, "0"));
      let scriptSig;
      if (input.scriptsig) {
        scriptSig =
          serializeVarInt(input.scriptsig.length / 2).toString("hex") +
          input.scriptsig;
      } else {
        scriptSig = "00";
      }
      let sequence = toLittleEndian(
        input.sequence.toString(16).padStart(8, "0")
      );
      return txid + vout + scriptSig + sequence;
    })
    .join("");

  let vout = tx.vout
    .map((output) => {
      let value = toLittleEndian(output.value.toString(16).padStart(16, "0"));
      let scriptPubKey =
        serializeVarInt(output.scriptpubkey.length / 2).toString("hex") +
        output.scriptpubkey;
      return value + scriptPubKey;
    })
    .join("");
  let witness = "";
  if (isSegwit) {
    witness = tx.vin
      .map((input) => {
        if (input.witness === undefined) {
          return "00";
        }
        let witness = input.witness
          .map((witness) => {
            return (
              serializeVarInt(witness.length / 2).toString("hex") + witness
            );
          })
          .join("");
        return serializeVarInt(input.witness.length).toString("hex") + witness;
      })
      .join("");
  }
  const serializedTransaction =
    version + vinCount + vin + voutCount + vout + locktime;
  const serializedWitnessTransaction = marker + flag + witness;
  const weight =
    4 * serializedTransaction.length + serializedWitnessTransaction.length;
  tx["weight"] = weight / 2;
  return (
    version +
    marker +
    flag +
    vinCount +
    vin +
    voutCount +
    vout +
    witness +
    locktime
  );
}
