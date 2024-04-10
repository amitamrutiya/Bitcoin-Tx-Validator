import verifyLegacyTransaction from "./verifyLegacyTransaction.js";
import verifySegwitTransaction from "./verifySegwitTransaction.js";

export function isValidSignature(transaction, signatures, publicKeys) {
  for (let outerInput of transaction.vin) {
    const isSegwit = outerInput.witness !== undefined;
    if (isSegwit) {
      for (let input of transaction.vin) {
        input.scriptsig = "";
      }
      if (outerInput.prevout.scriptpubkey_type === "p2sh") {
        const scriptsig_asm = outerInput.scriptsig_asm.split(" ");
        outerInput.scriptsig = scriptsig_asm[scriptsig_asm.length - 1];
      } else if (outerInput.prevout.scriptpubkey_type === "v0_p2wpkh") {
        outerInput.scriptsig = outerInput.prevout.scriptpubkey;
      } else {
        return true;
      }
      const isValid = verifySegwitTransaction(
        transaction,
        outerInput,
        signatures,
        publicKeys
      );
      if (!isValid) {
        console.log(`Invalid signature in ${outerInput.txid}`);
        return false;
      }
      // console.log(`Valid signature in ${outerInput.txid}`);
      return true;
    } else {
      for (let input of transaction.vin) {
        input.scriptsig = "";
      }
      if (outerInput.prevout.scriptpubkey_type === "p2sh") {
        const scriptsig_asm = outerInput.scriptsig_asm.split(" ");
        outerInput.scriptsig = scriptsig_asm[scriptsig_asm.length - 1];
      } else if (outerInput.prevout.scriptpubkey_type === "p2pkh") {
        outerInput.scriptsig = outerInput.prevout.scriptpubkey;
      }
      const isValid = verifyLegacyTransaction(
        transaction,
        outerInput,
        signatures,
        publicKeys
      );
      if (!isValid) {
        console.log(`Invalid signature in ${outerInput.txid}`);
        return false;
      }
      // console.log(`Valid signature in ${outerInput.txid}`);
      return true;
    }
  }
}
