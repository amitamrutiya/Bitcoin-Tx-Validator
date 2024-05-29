import { Transaction } from "../utils/types";
import { hash160, sha256 } from "./utils";
import { isValidSignature } from "./verifySignature";

// Function to execute a script for a transaction
export function executeScript(transaction: Transaction): boolean {
  let allValid = true;
  for (let input of transaction.vin) {
    let stack: (string | boolean)[] = [];
    let script = "";
    let scriptTokens: string[] = [];

    // Handle different types of scripts
    if (input.prevout.scriptpubkey_type === "p2pkh") {
      // Pay-to-Public-Key-Hash (P2PKH)
      script = input.scriptsig_asm + " " + input.prevout.scriptpubkey_asm;
      scriptTokens = script.split(" ");
    } else if (
      input.prevout.scriptpubkey_type === "p2sh" &&
      input.witness === undefined &&
      !input.inner_redeemscript_asm?.split(" ").includes("OP_CSV")
    ) {
      // Pay-to-Script-Hash (P2SH)
      const scriptsig_asm = input.scriptsig_asm.split(" ");
      const inner_redeemscript = [
        scriptsig_asm[scriptsig_asm.length - 2],
        scriptsig_asm[scriptsig_asm.length - 1],
      ];
      const scriptSig = input.scriptsig_asm.split(" ");
      scriptSig.splice(-2, 2);

      script = [
        ...scriptSig,
        ...(input.inner_redeemscript_asm?.split(" ") ?? []),
        ...inner_redeemscript,
        ...input.prevout.scriptpubkey_asm.split(" "),
      ].join(" ");
      scriptTokens = script.split(" ");
    } else if (
      input.prevout.scriptpubkey_type === "p2sh" &&
      input.witness !== undefined &&
      input.witness.length === 2
    ) {
      // P2SH with witness data
      script =
        "OP_CHECKSIG" +
        " " +
        input.scriptsig_asm +
        " " +
        input.prevout.scriptpubkey_asm;
      scriptTokens = script.split(" ");
      if (input.witness.length === 2) {
        stack.push(input.witness[0]);
        stack.push(input.witness[1]);
      }
    } else if (
      input.prevout.scriptpubkey_type === "p2sh" &&
      input.witness !== undefined &&
      input.witness.length > 2 &&
      !input.inner_witnessscript_asm?.split(" ").includes("OP_CSV") &&
      !input.inner_witnessscript_asm?.split(" ").includes("OP_DROP")
    ) {
      // P2SH with multiple witness data
      const signatures = input.witness.slice(1, -1);
      const scriptsig = input.scriptsig_asm.split(" ")[1];
      stack.push(...signatures);
      script =
        (input.inner_witnessscript_asm ?? "") +
        " " +
        scriptsig +
        " " +
        input.prevout.scriptpubkey_asm;
      scriptTokens = script.split(" ");
    } else if (
      input.prevout.scriptpubkey_type === "v0_p2wsh" &&
      input.witness !== undefined &&
      input.witness[0] === ""
    ) {
      // Pay-to-Witness-Script-Hash (P2WSH)
      const signatures = input.witness.slice(1, -1);
      const scriptsig = input.witness[input.witness.length - 1];
      stack.push(...signatures);
      script =
        (input.inner_witnessscript_asm ?? "") +
        " " +
        scriptsig +
        " OP_SHA256 " +
        input.prevout.scriptpubkey_asm +
        " OP_EQUAL";
      scriptTokens = script.split(" ");
    } else if (input.prevout.scriptpubkey_type === "v0_p2wpkh") {
      // Pay-to-Witness-Public-Key-Hash (P2WPKH)
      const pkh = input.prevout.scriptpubkey_asm.split(" ")[2];
      stack.push(input.witness![0]);
      stack.push(input.witness![1]);

      script = "OP_DUP OP_HASH160 " + pkh + " OP_EQUALVERIFY OP_CHECKSIG";

      scriptTokens = script.split(" ");
    } else {
      return false;
    }

    // Execute the script
    while (scriptTokens.length > 0) {
      const token = scriptTokens.shift();
      if (token === "OP_CHECKSIG") {
        // Check signature
        const publicKey = stack.pop() as string;
        const signature = stack.pop() as string;
        const isValid = isValidSignature(
          transaction,
          input,
          [signature],
          [publicKey]
        );
        stack.push(isValid);
      } else if (token === "OP_EQUALVERIFY") {
        // Check equality and verify
        const value1 = stack.pop();
        const value2 = stack.pop();
        if (value1 !== value2) {
          console.log("Values not equal in" + input.txid);
          return false; // Values not equal
        }
      } else if (token === "OP_EQUAL") {
        const value1 = stack.pop();
        const value2 = stack.pop();
        if (value1 === value2) {
          stack.push(true);
        } else {
          stack.push(false);
        }
      } else if (token === "OP_DUP") {
        // Duplicate the top item on the stack
        const topItem = stack[stack.length - 1];
        stack.push(topItem);
      } else if (token === "OP_HASH160") {
        // Apply the SHA-256 hash followed by the RIPEMD-160 hash to the top item on the stack
        const data = stack.pop() as string;
        const hashedData = hash160(data);
        stack.push(hashedData);
      } else if (token === "OP_PUSHDATA1") {
        const bytes = scriptTokens.shift();
        if (bytes === undefined) {
          console.log("No bytes found");
          return false;
        }
        stack.push(bytes);
      } else if (token?.startsWith("OP_PUSHBYTES_")) {
        // Push data onto the stack
        const bytesLength = parseInt(token.substring("OP_PUSHBYTES_".length));
        const bytes = scriptTokens.shift() as string;

        // Check that the length of bytes matches bytesLength
        if (bytes.length / 2 !== bytesLength) {
          console.log("Invalid number of bytes");
          return false;
        }
        stack.push(bytes);
      } else if (token === "OP_CHECKMULTISIG") {
        const n = parseInt(
          (stack.pop() as string).substring("OP_PUSHNUM_".length)
        );
        const publicKeys: string[] = [];
        for (let i = 0; i < n; i++) {
          publicKeys.push(stack.pop() as string);
        }
        const m = parseInt(
          (stack.pop() as string).substring("OP_PUSHNUM_".length)
        );

        const signatures: string[] = [];
        for (let i = 0; i < m; i++) {
          signatures.push(stack.pop() as string);
        }
        const isValid = isValidSignature(
          transaction,
          input,
          signatures,
          publicKeys
        );
        stack.push(isValid);
      } else if (token === "OP_0") {
      } else if (token === "OP_SHA256") {
        const data = stack.pop() as string;
        const hashedData = sha256(data);
        stack.push(hashedData);
      } else {
        stack.push(token!);
      }
    }

    // Check if the stack is empty and contains only true values
    for (let i = 0; i < stack.length; i++) {
      if (stack[i] !== true) {
        allValid = false;
      }
    }
    if (stack.length === 0) allValid = false;
  }
  return allValid;
}
