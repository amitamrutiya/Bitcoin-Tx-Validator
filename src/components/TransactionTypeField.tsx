import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TransactionSchema } from "@/utils/schema";
import { UseFormReturn } from "react-hook-form";

type TransactionTypeFieldProps = {
  form: UseFormReturn<TransactionSchema>;
};

function TransactionTypeField({ form }: TransactionTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem className="space-y-1 w-min">
          <FormLabel className="font-bold" htmlFor="type">
            Type
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex space-y-1 border border-primary rounded-md p-2"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="Legacy" />
                </FormControl>
                <FormLabel className="font-normal">Legacy</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="Segwit" />
                </FormControl>
                <FormLabel className="font-normal">Segwit</FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default TransactionTypeField;
