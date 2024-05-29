import React, { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus, X } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  inputDefaultValues,
  outputDefaultValues,
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

function TransactionForm() {
  const form: UseFormReturn<TransactionSchema> = useForm<TransactionSchema>({
    mode: "all",
    resolver: zodResolver(transactionSchema),
    defaultValues: TransactionDefaultValues,
  });

  const { watch } = form;

  function onSubmit(values: TransactionSchema) {
    console.log(values.inputs);
  }

  const [inputsNumber, setInputsNumber] = useState([0]);
  const [outputsNumber, setOutputsNumber] = useState([0]);

  return (
    <div className="bg-secondary border-b-blue-500 border rounded-lg px-5 py-5 flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <TransactionTypeField form={form} />
          <TransactionVersionField form={form} />
          {watch("type") === "Segwit" && <TransactionMarkerFlag form={form} />}
          <InputsSection
            form={form}
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

export default TransactionForm;
