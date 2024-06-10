"use client";

import { Block } from "@/utils/types";
import { useState } from "react";
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
import { TransactionDefaultValues, TransactionSchema } from "@/utils/schema";
import { TransactionForm } from "./TransactionForm";
import { mineTransaction } from "@/actions/mineTransaction";
import { useRouter } from "next/navigation";
import { getRandomTransaction } from "@/actions/getRandomTransaction";

function MainCard() {
  const router = useRouter();
  const [validateTransaction, setValidateTransaction] = useState(true);
  const [open, setOpen] = useState(false);
  const [minedBlock, setMinedBlock] = useState<Block>();
  const [allTransactions, setAllTransactions] = useState<TransactionSchema[]>([
    TransactionDefaultValues,
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  function onaddTransaction() {
    setAllTransactions((prevTransactions: TransactionSchema[]) => [
      TransactionDefaultValues,
      ...prevTransactions,
    ]);
  }

  async function onRandomTransaction(): Promise<void> {
    setLoading(true);
    setAllTransactions([]);
    let transactionNumber = 1;

    if (!validateTransaction) {
      // transaction Number between 5 to 10
      transactionNumber = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    }

    for (let i = 0; i < transactionNumber; i++) {
      const newTransaction = await getRandomTransaction();
      setAllTransactions((prevTransactions: TransactionSchema[]) => [
        ...prevTransactions,
        newTransaction,
      ]);
    }
    setLoading(false);
  }

  async function handleMineBlock(): Promise<void> {
    try {
      setLoading(true);
      const minedBlock = await mineTransaction(allTransactions);
      setMinedBlock(minedBlock);
    } catch (error) {
      setMinedBlock(undefined);
    } finally {
      setOpen(true);
      setLoading(false);
    }
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {minedBlock ? (
                <span className="text-bold text-3xl">
                  Block Mined Successfully
                </span>
              ) : (
                <span className="text-bold text-3xl">Error in Mining</span>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {minedBlock ? (
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
      <div className="flex flex-col gap-5 border md:p-20 sm:p-10 p-5 m-5">
        <div className="flex gap-5">
          <Button
            variant={validateTransaction ? "default" : "secondary"}
            onClick={() => setValidateTransaction(true)}
            className={`p-3 rounded-lg transform transition duration-300 ease-in-out hover:scale-110 `}
          >
            Validate Transaction
          </Button>
          <Button
            onClick={() => setValidateTransaction(false)}
            variant={validateTransaction ? "secondary" : "default"}
            className={` p-3 rounded-lg transform transition duration-300 ease-in-out hover:scale-110`}
          >
            Mine Transaction
          </Button>
          <Button
            onClick={() => router.push("/other-features")}
            className={
              "p-3 rounded-lg transform transition duration-300 ease-in-out hover:scale-110"
            }
            variant="secondary"
          >
            Other Features
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
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md hover:text-primary-foregound bg-primary transform transition duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onRandomTransaction}
            disabled={loading}
          >
            Random Example
          </Button>
        </div>
        {allTransactions.map((tx) => (
          <TransactionForm
            key={tx.TxId}
            defaultValues={tx ?? TransactionDefaultValues}
            checkValid={true}
            loading={loading}
          />
        ))}

        {!validateTransaction && (
          <Button type="button" variant="secondary" onClick={onaddTransaction}>
            Add Transaction
          </Button>
        )}

        {!validateTransaction && (
          <Button type="button" variant="secondary" onClick={handleMineBlock}>
            Mine Block
          </Button>
        )}
      </div>
    </>
  );
}

export default MainCard;
