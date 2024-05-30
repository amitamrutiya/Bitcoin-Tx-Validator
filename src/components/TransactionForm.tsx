import { use, useEffect, useState } from "react";
import { useForm, UseFormReturn, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "./ui/separator";
import {
  TransactionDefaultValues,
  transactionSchema,
  TransactionSchema,
} from "@/utils/schema";
import TransactionTypeField from "./TransactionTypeField";
import TransactionVersionField from "./TransactionVersionField";
import InputsSection from "./InputsSection";
import OutputsSection from "./OutputSection";
import LocktimeField from "./LocktimeField";
import TransactionMarkerFlag from "./TransactionMarkerFlag";
import { isTransactionValid } from "@/actions/isTransactionValid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type TransactionFormProps = {
  defaultValues: TransactionSchema | null;
};

export function TransactionForm({ defaultValues }: TransactionFormProps) {
  const form: UseFormReturn<TransactionSchema> = useForm<TransactionSchema>({
    mode: "all",
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues ?? TransactionDefaultValues,
  });
  const [serializeTransaction, setSerializeTransaction] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isSegwit, setIsSegwit] = useState<boolean>(false);

  useEffect(() => {
    if (defaultValues) {
      setIsSegwit(defaultValues.vin.some((tx) => tx.witness !== undefined));
    }
  }, [defaultValues]);

  async function onSubmit(values: TransactionSchema) {
    try {
      const data = await isTransactionValid(values);
      setIsValid(data.isValid);
      setSerializeTransaction(data.seralizedTransaction);
    } catch (error) {
      console.log(error);
      setIsValid(false);
    } finally {
      setOpen(true);
    }
  }

  const [inputsNumber, setInputsNumber] = useState([0]);
  const [outputsNumber, setOutputsNumber] = useState([0]);

  const vin = useWatch({ control: form.control, name: "vin" });
  const vout = useWatch({ control: form.control, name: "vout" });

  useEffect(() => {
    form.reset(defaultValues ?? TransactionDefaultValues);
  }, [defaultValues, form]);

  useEffect(() => {
    if (vin) {
      setInputsNumber([...Array(vin.length).keys()]);
    }

    if (vout) {
      setOutputsNumber([...Array(vout.length).keys()]);
    }
  }, [vin, vout]);

  const [open, setOpen] = useState(false);

  return (
    <div className="bg-secondary border-b-blue-500 border rounded-lg p-5 flex flex-col">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isValid ? (
                <span className="text-bold text-3xl">Transaction is Valid</span>
              ) : (
                <span className="text-bold text-3xl">
                  Transaction is not Valid
                </span>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isValid ? (
                <span className="text-lg">
                  Your transaction is valid and ready to be mined
                </span>
              ) : (
                <span className="text-lg">Your transaction is not valid</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <TransactionTypeField setIsSegwit={setIsSegwit} isSegwit={isSegwit} />
          <TransactionVersionField form={form} />
          {isSegwit && <TransactionMarkerFlag form={form} />}
          <InputsSection
            form={form}
            isSegwit={isSegwit}
            inputsNumber={inputsNumber}
            setInputsNumber={setInputsNumber}
          />
          <OutputsSection
            form={form}
            outputsNumber={outputsNumber}
            setOutputsNumber={setOutputsNumber}
          />
          <LocktimeField form={form} />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <Separator className="bg-primary my-4" />
      <p className="text-3xl font-bold">Raw Transaction Data</p>
      <Textarea
        className="resize-none my-3"
        defaultValue={serializeTransaction}
        disabled
        rows={6}
      />
    </div>
  );
}
