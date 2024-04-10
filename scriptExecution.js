import { isValidSignature } from "./verifySignature.js";
import { hash160 } from "./utils.js";

export function executeScript(transaction) {
  for (let input of transaction.vin) {
    let stack = [];
    let script = "";
    let scriptTokens = [];

    if (input.prevout.scriptpubkey_type === "p2pkh") {
      script = input.scriptsig_asm + " " + input.prevout.scriptpubkey_asm;
      scriptTokens = script.split(" ");
    } else if (
      input.prevout.scriptpubkey_type === "p2sh" &&
      input.witness === undefined
    ) {
      const inner_redeemscript = [
        input.scriptsig_asm.split(" ")[
          input.scriptsig_asm.split(" ").length - 2
        ],
        input.scriptsig_asm.split(" ")[
          input.scriptsig_asm.split(" ").length - 1
        ],
      ];
      const scriptSig = input.scriptsig_asm.split(" ");
      scriptSig.splice(-2, 2);

      script = [
        ...scriptSig,
        ...input.inner_redeemscript_asm.split(" "),
        ...inner_redeemscript,
        ...input.prevout.scriptpubkey_asm.split(" "),
      ];
      scriptTokens = script;
      // console.log(scriptTokens);
    } else if (
      input.prevout.scriptpubkey_type === "p2sh" &&
      input.witness !== undefined &&
      input.witness.length === 2
    ) {
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
      console.log(stack);
    } else if (input.prevout.scriptpubkey_type === "v0_p2wpkh") {
      const pkh = input.prevout.scriptpubkey_asm.split(" ")[2];
      stack.push(input.witness[0]);
      stack.push(input.witness[1]);

      script = "OP_DUP OP_HASH160 " + pkh + " OP_EQUALVERIFY OP_CHECKSIG";

      scriptTokens = script.split(" ");
    }
    while (scriptTokens.length > 0) {
      const token = scriptTokens.shift();
      if (token === "OP_CHECKSIG") {
        // Check signature
        const publicKey = stack.pop();
        const signature = stack.pop();
        const isValid = isValidSignature(transaction, [signature], [publicKey]);
        stack.push(isValid);
      } else if (token === "OP_EQUALVERIFY") {
        // Check equality and verify
        const value1 = stack.pop();
        const value2 = stack.pop();
        if (value1 !== value2) {
          console.log("Values not equal");
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
        const data = stack.pop();
        const hashedData = hash160(data);
        stack.push(hashedData);
      } else if (token === "OP_PUSHDATA1") {
        const bytes = scriptTokens.shift();
        stack.push(bytes);
      } else if (token.startsWith("OP_PUSHBYTES_")) {
        // Push data onto the stack
        const bytesLength = parseInt(token.substring("OP_PUSHBYTES_".length));
        const bytes = scriptTokens.shift();

        // Check that the length of bytes matches bytesLength
        if (bytes.length / 2 !== bytesLength) {
          console.log("Invalid number of bytes");
          return false;
        }
        stack.push(bytes);
      } else if (token === "OP_PUSHNUM_1") {
        // Push number 1 onto the stack
        stack.push(1);
      } else if (token === "OP_0") {
      } else if (token === "OP_CHECKMULTISIG") {
        const n = parseInt(stack.pop().substring("OP_PUSHNUM_".length));
        const publicKeys = [];
        for (let i = 0; i < n; i++) {
          publicKeys.push(stack.pop());
        }

        const m = parseInt(stack.pop().substring("OP_PUSHNUM_".length));
        const signatures = [];
        for (let i = 0; i < m; i++) {
          signatures.push(stack.pop());
        }
        // console.log("Public keys: ", publicKeys);
        // console.log("Signatures: ", signatures);
        const isValid = isValidSignature(transaction, signatures, publicKeys);
        stack.push(isValid);
      } else {
        // Other script tokens (e.g., signatures, public keys)
        stack.push(token);
      }
      // Log the state of the stack
      // console.log(`After executing ${token}, stack is: `, stack);
    }

    // Check if the stack is empty and contains only true values
    for (let i = 0; i < stack.length; i++) {
      if (stack[i] !== true) {
        return false;
      }
    }
    return true;
  }
}
