import verifyLegacyTransaction from "./verifyLegacyTransaction.js";
import verifySegwitTransaction from "./verifySegwitTransaction.js";

// Function to check if a signature is valid
export function isValidSignature(
  transaction,
  outerInput,
  signatures,
  publicKeys
) {
  // Check if the transaction is SegWit
  const isSegwit = outerInput.witness !== undefined;
  if (isSegwit) {
    // Clear the scriptsig for all inputs
    for (let input of transaction.vin) {
      input.scriptsig = "";
    }
    // Determine the scriptsig based on the scriptpubkey type
    if (outerInput.prevout.scriptpubkey_type === "p2sh") {
      const scriptsig_asm = outerInput.scriptsig_asm.split(" ");
      outerInput.scriptsig = scriptsig_asm[scriptsig_asm.length - 1];
    } else if (outerInput.prevout.scriptpubkey_type === "v0_p2wpkh") {
      outerInput.scriptsig = outerInput.prevout.scriptpubkey;
    } else {
      return false;
    }
    // Verify the SegWit transaction
    const isValid = verifySegwitTransaction(
      transaction,
      outerInput,
      signatures,
      publicKeys
    );
    if (!isValid) {
      return false;
    }
    return true;
  } else {
    // Clear the scriptsig for all inputs
    for (let input of transaction.vin) {
      input.scriptsig = "";
    }
    // Determine the scriptsig based on the scriptpubkey type
    if (outerInput.prevout.scriptpubkey_type === "p2sh") {
      const scriptsig_asm = outerInput.scriptsig_asm.split(" ");
      outerInput.scriptsig = scriptsig_asm[scriptsig_asm.length - 1];
    } else if (outerInput.prevout.scriptpubkey_type === "p2pkh") {
      outerInput.scriptsig = outerInput.prevout.scriptpubkey;
    } else {
      return false;
    }
    // Verify the legacy transaction
    const isValid = verifyLegacyTransaction(
      transaction,
      outerInput,
      signatures,
      publicKeys
    );
    if (!isValid) {
      return false;
    }
    return true;
  }
}