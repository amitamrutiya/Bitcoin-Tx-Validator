import { toLittleEndian, serializeVarInt } from "./utils.js";

// Function to serialize a witness transaction
export function serializeWitnessTransaction(tx) {
  // Convert version to little endian format
  let version = toLittleEndian(tx.version.toString(16).padStart(8, "0"));

  // Check if the transaction is SegWit
  const isSegwit = tx.vin.some((input) => input.witness !== undefined);

  let marker = "";
  let flag = "";

  // If transaction is SegWit, set marker and flag
  if (isSegwit) {
    marker = "00";
    flag = "01";
  }

  // Convert locktime to little endian format
  let locktime = toLittleEndian(tx.locktime.toString(16).padStart(8, "0"));

  // Serialize the number of inputs and outputs
  let vinCount = serializeVarInt(tx.vin.length).toString("hex");
  let voutCount = serializeVarInt(tx.vout.length).toString("hex");

  // Serialize each input
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

  // Serialize each output
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

  // If transaction is SegWit, serialize each witness
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

  // Concatenate all serialized parts to form the complete transaction
  const serializedTransaction =
    version + vinCount + vin + voutCount + vout + locktime;

  // Concatenate all serialized parts to form the complete witness transaction
  const serializedWitnessTransaction = marker + flag + witness;

  // Calculate the weight of the transaction
  const weight =
    4 * serializedTransaction.length + serializedWitnessTransaction.length;

  // Add the weight to the transaction
  tx["weight"] = weight / 2;

  // Return the serialized transaction
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
