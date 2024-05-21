"use client";

import { isTransactionValid } from "@/actions/isTransactionValid";
import { Transaction } from "@/types";
import { FormEvent, useState } from "react";

export default function App() {
  const dummyTransaction: Transaction = {
    version: 1,
    locktime: 0,
    vin: [
      {
        txid: "3b7dc918e5671037effad7848727da3d3bf302b05f5ded9bec89449460473bbb",
        vout: 16,
        prevout: {
          scriptpubkey: "0014f8d9f2203c6f0773983392a487d45c0c818f9573",
          scriptpubkey_asm:
            "OP_0 OP_PUSHBYTES_20 f8d9f2203c6f0773983392a487d45c0c818f9573",
          scriptpubkey_type: "v0_p2wpkh",
          scriptpubkey_address: "bc1qlrvlygpudurh8xpnj2jg04zupjqcl9tnk5np40",
          value: 37079526,
        },
        scriptsig: "",
        scriptsig_asm: "",
        witness: [
          "30440220780ad409b4d13eb1882aaf2e7a53a206734aa302279d6859e254a7f0a7633556022011fd0cbdf5d4374513ef60f850b7059c6a093ab9e46beb002505b7cba0623cf301",
          "022bf8c45da789f695d59f93983c813ec205203056e19ec5d3fbefa809af67e2ec",
        ],
        is_coinbase: false,
        sequence: 4294967295,
      },
    ],
    vout: [
      {
        scriptpubkey: "76a9146085312a9c500ff9cc35b571b0a1e5efb7fb9f1688ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 6085312a9c500ff9cc35b571b0a1e5efb7fb9f16 OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "19oMRmCWMYuhnP5W61ABrjjxHc6RphZh11",
        value: 100000,
      },
      {
        scriptpubkey: "0014ad4cc1cc859c57477bf90d0f944360d90a3998bf",
        scriptpubkey_asm:
          "OP_0 OP_PUSHBYTES_20 ad4cc1cc859c57477bf90d0f944360d90a3998bf",
        scriptpubkey_type: "v0_p2wpkh",
        scriptpubkey_address: "bc1q44xvrny9n3t5w7lep58egsmqmy9rnx9lt6u0tc",
        value: 36977942,
      },
    ],
  };
  const [validateTransaction, setValidateTransaction] = useState(true);
  const [transaction, setTransaction] = useState<Transaction>(dummyTransaction);

  async function handleFormSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    const isValid = await isTransactionValid(transaction);
    console.log(isValid);
  }

  async function getRandomTransaction(): Promise<void> {
    const response = await fetch("/api/randomTransaction");
    const data = await response.json();
    console.log(data);
    setTransaction(data);
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-secondary-foreground">
      <div className="flex flex-col gap-10 border p-20">
        <div className="flex gap-5">
          <button
            onClick={() => setValidateTransaction(true)}
            className={`${
              validateTransaction
                ? "bg-primary text-secondary"
                : "bg-secondary text-primary"
            } p-3 rounded-lg transform transition duration-300 ease-in-out hover:scale-110`}
          >
            Validate Transaction
          </button>
          <button
            onClick={() => setValidateTransaction(false)}
            className={`${
              !validateTransaction
                ? "bg-primary text-secondary"
                : "bg-secondary text-primary"
            } p-3 rounded-lg transform transition duration-300 ease-in-out hover:scale-110`}
          >
            Mine Transaction
          </button>
        </div>
        {validateTransaction ? (
          <h1 className="text-5xl font-bold text-secondary">
            Validate your bitcoin Transaction
          </h1>
        ) : (
          <h1 className="text-5xl font-bold text-secondary">
            Mine Your Bitcoin Transactions
          </h1>
        )}
        <div className="text-2xl font-medium text-primary mb-4 flex justify-between">
          Enter your Bitcoin transaction
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-secondary bg-primary transform transition duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={getRandomTransaction}
          >
            Random Example
          </button>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="mt-1">
            <textarea
              id="transaction"
              name="transaction"
              rows={20}
              className="shadow-sm mt-1 block w-full sm:text-sm rounded-md p-4"
              placeholder="Enter your transaction here"
              value={JSON.stringify(transaction, null, 2)}
              onChange={(e) =>
                setTransaction(JSON.parse(JSON.stringify(e.target.value)))
              }
            />
          </div>
          <button
            type="submit"
            className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-secondary bg-primary transform transition duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
