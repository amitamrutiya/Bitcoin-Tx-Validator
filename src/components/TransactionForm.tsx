import { useEffect, useState } from "react";
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

export function TransactionForm({
  defaultValues,
}: {
  defaultValues: TransactionSchema | null;
}) {
  console.log(defaultValues);
  const form: UseFormReturn<TransactionSchema> = useForm<TransactionSchema>({
    mode: "all",
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues ?? TransactionDefaultValues,
  });

  function onSubmit(values: TransactionSchema) {
    console.log(values);
  }

  const [inputsNumber, setInputsNumber] = useState([0]);
  const [outputsNumber, setOutputsNumber] = useState([0]);
  const [isSegwit, setIsSegwit] = useState<boolean>(false);

  const vin = useWatch({ control: form.control, name: "vin" });
  const vout = useWatch({ control: form.control, name: "vout" });

  useEffect(() => {
    form.reset(defaultValues ?? TransactionDefaultValues);
    if (vin) {
      setInputsNumber([...Array(vin.length).keys()]);
    }

    if (vout) {
      setOutputsNumber([...Array(vout.length).keys()]);
    }
  }, [defaultValues]);

  useEffect(() => {}, [vin, vout]);

  return (
    <div className="bg-secondary border-b-blue-500 border rounded-lg px-5 py-5 flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <TransactionTypeField setIsSegwit={setIsSegwit} />
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
      <Textarea className="resize-none my-3" />
    </div>
  );
}
