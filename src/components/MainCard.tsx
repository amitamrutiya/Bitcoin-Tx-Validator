"use client";

import { isTransactionValid } from "@/actions/isTransactionValid";
import { mineTransaction } from "@/actions/mineTransaction";
import { Block, Transaction } from "@/utils/types";
import { FormEvent, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { JsonViewer } from "@textea/json-viewer";
import { Button } from "@/components/ui/button";
import TransactionForm from "./TransactionForm";

function MainCard({ dummyTransaction }: { dummyTransaction: Transaction }) {
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
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
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
      <div className="flex flex-col gap-10 border p-20 max-w-screen-lg">
        <div className="flex gap-5">
          <Button
            onClick={() => setValidateTransaction(true)}
            className={`${
              validateTransaction
                ? "bg-primary text-secondary"
                : "bg-secondary text-primary"
            } p-3 rounded-lg transform transition duration-300 ease-in-out hover:scale-110`}
          >
            Validate Transaction
          </Button>
          <Button
            onClick={() => setValidateTransaction(false)}
            className={`${
              !validateTransaction
                ? "bg-primary text-secondary"
                : "bg-secondary text-primary"
            } p-3 rounded-lg transform transition duration-300 ease-in-out hover:scale-110`}
          >
            Mine Transaction
          </Button>
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
          <Button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-secondary bg-primary transform transition duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={getRandomTransaction}
          >
            Random Example
          </Button>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="mt-1">
            {/* <JsonViewer
              value={transactions}
              editable
              theme={"dark"}
              enableDelete
              displayDataTypes={false}
              enableClipboard
              defaultInspectDepth={3}
              className="p-4 bg-transparent text-lg"
              onChange={(path, oldValue, newValue) => {
                setTransactions((prevTransactions) => {
                  const newTransactions = [...prevTransactions];

                  const updateValue = (obj: any[], path: any, value: any) => {
                    if (path.length === 1) {
                      obj[path[0]] = value;
                    } else {
                      updateValue(obj[path[0]], path.slice(1), value);
                    }
                  };

                  updateValue(newTransactions, path, newValue);

                  return newTransactions;
                });
              }}
              onDelete={(a, b) => {
                console.log(a, b);
              }}
              enableAdd={true}
              onAdd={(a) => {
                console.log(a);
              }}
            /> */}
            <TransactionForm />
          </div>
        </form>
      </div>
    </>
  );
}

export default MainCard;
