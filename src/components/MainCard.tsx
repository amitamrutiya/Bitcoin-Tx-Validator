"use client";

import { isTransactionValid } from "@/actions/isTransactionValid";
import { mineTransaction } from "@/actions/mineTransaction";
import { Block, Transaction, TransactionInput } from "@/utils/types";
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
import { Button } from "@/components/ui/button";
import { TransactionSchema } from "@/utils/schema";
import { TransactionForm } from "./TransactionForm";

function MainCard() {
  const [validateTransaction, setValidateTransaction] = useState(true);
  const [transaction, setTransaction] = useState<TransactionSchema | null>();
  const [open, setOpen] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [minedBlock, setMinedBlock] = useState<Block>();
  const [isSegwit, setIsSegwit] = useState<boolean>(false);

  async function getRandomTransaction(): Promise<void> {
    let transactionNumber = 1;

    if (!validateTransaction) {
      // transaction Number between 5 to 10
      transactionNumber = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    }

    for (let i = 0; i < transactionNumber; i++) {
      const response = await fetch("/api/randomTransaction");
      const newTransaction = await response.json();
      const isSegwit = newTransaction.vin.some(
        (input: TransactionInput) => input.witness !== undefined
      );
      setIsSegwit(isSegwit);
      setTransaction(newTransaction);
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
        <TransactionForm
          defaultValues={transaction!}
          isSegwit={isSegwit}
          setIsSegwit={setIsSegwit}
        />
      </div>
    </>
  );
}

export default MainCard;
