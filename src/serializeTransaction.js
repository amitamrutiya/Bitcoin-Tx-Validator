import { toLittleEndian, serializeVarInt } from "./utils.js";

export function serializeTransaction(tx) {
  let version = toLittleEndian(tx.version.toString(16).padStart(8, "0"));
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

  return version + vinCount + vin + voutCount + vout + locktime;
}
