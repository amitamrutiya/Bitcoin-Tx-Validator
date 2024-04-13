export function serializeWitnessTransaction(tx) {
  function toLittleEndian(hex) {
    return Buffer.from(hex, "hex").reverse().toString("hex");
  }

  function encodeUInt32LE(value) {
    const buf = Buffer.alloc(4);
    buf.writeUInt32LE(value, 0);
    return buf.toString("hex");
  }

  function encodeUInt64LE(value) {
    const buf = Buffer.alloc(8);
    buf.writeBigUInt64LE(BigInt(value), 0);
    return buf.toString("hex");
  }

  function encodeVarInt(value) {
    if (value < 0xfd) {
      return encodeUInt8(value);
    } else if (value <= 0xffff) {
      return "fd" + encodeUInt16LE(value);
    } else if (value <= 0xffffffff) {
      return "fe" + encodeUInt32LE(value);
    } else {
      return "ff" + encodeUInt64LE(value);
    }
  }

  function encodeUInt8(value) {
    const buf = Buffer.alloc(1);
    buf.writeUInt8(value, 0);
    return buf.toString("hex");
  }

  function encodeUInt16LE(value) {
    const buf = Buffer.alloc(2);
    buf.writeUInt16LE(value, 0);
    return buf.toString("hex");
  }

  let version = toLittleEndian(tx.version.toString(16).padStart(8, "0"));
  let marker = "00";
  let flag = "01";
  let locktime = toLittleEndian(tx.locktime.toString(16).padStart(8, "0"));
  let vinCount = encodeVarInt(tx.vin.length);
  let voutCount = encodeVarInt(tx.vout.length);

  let vin = tx.vin
    .map((input) => {
      let txid = toLittleEndian(input.txid);
      let vout = toLittleEndian(input.vout.toString(16).padStart(8, "0"));
      let scriptSig;
      if (input.scriptsig) {
        scriptSig = encodeVarInt(input.scriptsig.length / 2) + input.scriptsig;
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
        encodeVarInt(output.scriptpubkey.length / 2) + output.scriptpubkey;
      return value + scriptPubKey;
    })
    .join("");

  let witness = tx.vin
    .map((input) => {
      if (input.witness === undefined) {
        return "";
      }
      let witness = input.witness
        .map((witness) => {
          return encodeVarInt(witness.length / 2) + witness;
        })
        .join("");
      return encodeVarInt(input.witness.length) + witness;
    })
    .join("");
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
