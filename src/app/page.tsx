"use client";

import { isTransactionValid } from "@/actions/isTransactionValid";
import { mineTransaction } from "@/actions/mineTransaction";
import { Block, Transaction } from "@/types";
import { FormEvent, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function App() {
  const dummyTransaction: Transaction = {
    version: 2,
    locktime: 0,
    vin: [
      {
        txid: "1fba67ce9100df40f19ccb4d4062893b3c27987b9cbecf76311cbe554527e39b",
        vout: 2,
        prevout: {
          scriptpubkey: "a9149cd03e792c7004be9aa5005d46653f28268416db87",
          scriptpubkey_asm:
            "OP_HASH160 OP_PUSHBYTES_20 9cd03e792c7004be9aa5005d46653f28268416db OP_EQUAL",
          scriptpubkey_type: "p2sh",
          scriptpubkey_address: "3FzAoX2s7GhrZUZR4WXs1CvTKUGd7Ze6YM",
          value: 1380629466,
        },
        scriptsig:
          "004730440220223ab514db7dc474fb3f4734f26fa8ba45cb7f5086972b9ffad31fa0548a15b9022043f38bec2672ddfc8bea2bb22637897b65a893fe27970fb0147c01bc7ee3d1540147304402206e7353155483343dbed44808d8ea48f643ee015e257797a22d4712e02e2cf3d702204824ba9a16398823b1f50ef1643ecef5daf1a5723bd1f7a241c9557743747a6b014c6952210395f33d5a959556ba6b57298066baf468c2e5ab3cc58ddaf7166f057fae1655a7210246aae217f1102dde12a7e77203f7114de07f0068cfb1a3d825fff4ca2266737621028ace79c534a3b5c482b6cc446ea20d757e88c516ec054ae31c7a47863864904853ae",
        scriptsig_asm:
          "OP_0 OP_PUSHBYTES_71 30440220223ab514db7dc474fb3f4734f26fa8ba45cb7f5086972b9ffad31fa0548a15b9022043f38bec2672ddfc8bea2bb22637897b65a893fe27970fb0147c01bc7ee3d15401 OP_PUSHBYTES_71 304402206e7353155483343dbed44808d8ea48f643ee015e257797a22d4712e02e2cf3d702204824ba9a16398823b1f50ef1643ecef5daf1a5723bd1f7a241c9557743747a6b01 OP_PUSHDATA1 52210395f33d5a959556ba6b57298066baf468c2e5ab3cc58ddaf7166f057fae1655a7210246aae217f1102dde12a7e77203f7114de07f0068cfb1a3d825fff4ca2266737621028ace79c534a3b5c482b6cc446ea20d757e88c516ec054ae31c7a47863864904853ae",
        is_coinbase: false,
        sequence: 4294967295,
        inner_redeemscript_asm:
          "OP_PUSHNUM_2 OP_PUSHBYTES_33 0395f33d5a959556ba6b57298066baf468c2e5ab3cc58ddaf7166f057fae1655a7 OP_PUSHBYTES_33 0246aae217f1102dde12a7e77203f7114de07f0068cfb1a3d825fff4ca22667376 OP_PUSHBYTES_33 028ace79c534a3b5c482b6cc446ea20d757e88c516ec054ae31c7a478638649048 OP_PUSHNUM_3 OP_CHECKMULTISIG",
      },
      {
        txid: "e33a5b1a6e658904b783deb7ba64cb2e7987f2d6cd5bd24d223a0a71d038b288",
        vout: 3,
        prevout: {
          scriptpubkey: "a9149cd03e792c7004be9aa5005d46653f28268416db87",
          scriptpubkey_asm:
            "OP_HASH160 OP_PUSHBYTES_20 9cd03e792c7004be9aa5005d46653f28268416db OP_EQUAL",
          scriptpubkey_type: "p2sh",
          scriptpubkey_address: "3FzAoX2s7GhrZUZR4WXs1CvTKUGd7Ze6YM",
          value: 1337178870,
        },
        scriptsig:
          "00483045022100be8371f6121556e1297303c328ebc987655c5ea0026e8613db0b627351ebde8d02200ed2d522a2107656736a8b28b4e5706a837e4fec5f750b2a8ebbbe416b34b154014730440220388acbdeecc2b7344199a08592a32d5b3714569a90c8f1c9e383a70c1929253102200865cad74e1c76dde824ced51d60dfff80be1df8f3009c8e188946686ec046d2014c6952210395f33d5a959556ba6b57298066baf468c2e5ab3cc58ddaf7166f057fae1655a7210246aae217f1102dde12a7e77203f7114de07f0068cfb1a3d825fff4ca2266737621028ace79c534a3b5c482b6cc446ea20d757e88c516ec054ae31c7a47863864904853ae",
        scriptsig_asm:
          "OP_0 OP_PUSHBYTES_72 3045022100be8371f6121556e1297303c328ebc987655c5ea0026e8613db0b627351ebde8d02200ed2d522a2107656736a8b28b4e5706a837e4fec5f750b2a8ebbbe416b34b15401 OP_PUSHBYTES_71 30440220388acbdeecc2b7344199a08592a32d5b3714569a90c8f1c9e383a70c1929253102200865cad74e1c76dde824ced51d60dfff80be1df8f3009c8e188946686ec046d201 OP_PUSHDATA1 52210395f33d5a959556ba6b57298066baf468c2e5ab3cc58ddaf7166f057fae1655a7210246aae217f1102dde12a7e77203f7114de07f0068cfb1a3d825fff4ca2266737621028ace79c534a3b5c482b6cc446ea20d757e88c516ec054ae31c7a47863864904853ae",
        is_coinbase: false,
        sequence: 4294967295,
        inner_redeemscript_asm:
          "OP_PUSHNUM_2 OP_PUSHBYTES_33 0395f33d5a959556ba6b57298066baf468c2e5ab3cc58ddaf7166f057fae1655a7 OP_PUSHBYTES_33 0246aae217f1102dde12a7e77203f7114de07f0068cfb1a3d825fff4ca22667376 OP_PUSHBYTES_33 028ace79c534a3b5c482b6cc446ea20d757e88c516ec054ae31c7a478638649048 OP_PUSHNUM_3 OP_CHECKMULTISIG",
      },
    ],
    vout: [
      {
        scriptpubkey: "76a91400fae4774da408bfd5c483e5b44cc7a8c7ce93d288ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 00fae4774da408bfd5c483e5b44cc7a8c7ce93d2 OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "116BZK8yqkKS9YQ7SGfKGJ92oZcnymEWq5",
        value: 1603221518,
      },
      {
        scriptpubkey: "76a914251f99100ab56057b1944aa5300a67670a290ffc88ac",
        scriptpubkey_asm:
          "OP_DUP OP_HASH160 OP_PUSHBYTES_20 251f99100ab56057b1944aa5300a67670a290ffc OP_EQUALVERIFY OP_CHECKSIG",
        scriptpubkey_type: "p2pkh",
        scriptpubkey_address: "14PHrZPPFgzusKLAThaAs7jsk7o66de428",
        value: 916810,
      },
      {
        scriptpubkey: "a9149cd03e792c7004be9aa5005d46653f28268416db87",
        scriptpubkey_asm:
          "OP_HASH160 OP_PUSHBYTES_20 9cd03e792c7004be9aa5005d46653f28268416db OP_EQUAL",
        scriptpubkey_type: "p2sh",
        scriptpubkey_address: "3FzAoX2s7GhrZUZR4WXs1CvTKUGd7Ze6YM",
        value: 1113656311,
      },
    ],
  };

  const [validateTransaction, setValidateTransaction] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([
    dummyTransaction,
  ]);
  const [open, setOpen] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [minedBlock, setMinedBlock] = useState<Block>();

  async function handleFormSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    if (validateTransaction) {
      console.log("Validating your transaction");
      const isValid = await isTransactionValid(transactions[0]);
      setOpen(true);
      setIsValid(isValid);
      console.log(isValid);
    } else {
      console.log("Miningin your transactions");
      const minedBlock = await mineTransaction(transactions);
      setOpen(true);
      setMinedBlock(minedBlock);
      console.log(minedBlock);
    }
  }

  async function getRandomTransaction(): Promise<void> {
    setTransactions([]);
    let transactionNumber = 1;

    if (!validateTransaction) {
      // transaction Number between 5 to 10
      transactionNumber = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    }

    for (let i = 0; i < transactionNumber; i++) {
      const response = await fetch("/api/randomTransaction");
      const newTransaction = await response.json();
      setTransactions((prevTransactions: Transaction[]) => [
        newTransaction,
        ...prevTransactions,
      ]);
    }
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-secondary-foreground">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent >
          <AlertDialogHeader>
            <AlertDialogTitle>
              {validateTransaction ? (
                isValid ? (
                  <span className="text-bold text-3xl">
                    Transaction is Valid
                  </span>
                ) : (
                  <span className="text-bold text-3xl">
                    Transaction is not Valid
                  </span>
                )
              ) : minedBlock ? (
                <span className="text-bold text-3xl">
                  Block Mined Successfully
                </span>
              ) : (
                <span className="text-bold text-3xl">Error in Mining</span>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {validateTransaction ? (
                isValid ? (
                  <span className="text-lg">
                    Your transaction is valid and ready to be mined
                  </span>
                ) : (
                  <span className="text-lg">Your transaction is not valid</span>
                )
              ) : minedBlock ? (
                <div>
                  <span className="text-lg">Your Mined Block is Here</span>
                  <textarea
                    id="transaction"
                    name="transaction"
                    rows={30}
                    className="shadow-sm mt-1 block w-full sm:text-sm rounded-md p-4 "
                    placeholder="Enter your transaction here"
                    value={JSON.stringify(minedBlock, null, 2)}
                    disabled={true}
                  />
                </div>
              ) : (
                "Error in mining"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              value={JSON.stringify(transactions, null, 2)}
              onChange={(e) =>
                setTransactions(JSON.parse(JSON.stringify(e.target.value)))
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
