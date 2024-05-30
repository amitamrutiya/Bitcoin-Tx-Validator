import { TransactionSchema } from "@/utils/schema";
import { toLittleEndian, serializeVarInt } from "./utils";

// Function to serialize a transaction
export function serializeTransaction(tx: TransactionSchema): string {
  // Convert version and locktime to little endian format
  let version = toLittleEndian(tx.version.toString(16).padStart(8, "0"));
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
      // If scriptsig exists, serialize it
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
      // Return the serialized input
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
      // Return the serialized output
      return value + scriptPubKey;
    })
    .join("");

  // Return the serialized transaction
  return version + vinCount + vin + voutCount + vout + locktime;
}
