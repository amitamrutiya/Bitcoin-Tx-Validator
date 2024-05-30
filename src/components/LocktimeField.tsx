import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TransactionSchema } from "@/utils/schema";
import { UseFormReturn } from "react-hook-form";

type LocktimeFieldProps = {
  form: UseFormReturn<TransactionSchema>;
};

function LocktimeField({ form }: LocktimeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="locktime"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold">Locktime</FormLabel>
          <FormControl>
            <Input {...field} type="number" className="w-[150px]" />
          </FormControl>
          <FormMessage className="text-muted-foreground text-xs">
            Set locktime to 0 to make the transaction final.
          </FormMessage>
        </FormItem>
      )} />
  );
}

export default LocktimeField;
