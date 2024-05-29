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

type TransactionVersionFieldProps = {
  form: UseFormReturn<TransactionSchema>;
};

function TransactionVersionField({ form }: TransactionVersionFieldProps) {
  return (
    <FormField
      control={form.control}
      name="version"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold">Version</FormLabel>
          <FormControl>
            <Input {...field} type="number" className="w-[200px]" />
          </FormControl>
          <FormMessage className="text-muted-foreground text-xs">
            Version numbers greater than 2 are not yet in use.
          </FormMessage>
        </FormItem>
      )}
    />
  );
}

export default TransactionVersionField;
