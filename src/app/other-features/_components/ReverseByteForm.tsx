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
import { Label } from "@/components/ui/label";
import { reverseBytes } from "@/service/utils";
import { ReverseBytesSchema, reverseBytesSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

function ReverseByteForm() {
  const [byte, setByte] = useState<string>("");
  const form: UseFormReturn<ReverseBytesSchema> = useForm<ReverseBytesSchema>({
    mode: "all",
    resolver: zodResolver(reverseBytesSchema),
    defaultValues: {
      bytes: "",
    },
  });

  function onSubmit(data: ReverseBytesSchema) {
    const returnByte = reverseBytes(data.bytes);
    setByte(returnByte);
  }
  return (
    <div className="bg-secondary border-b-blue-500 border rounded-lg p-4 flex flex-col space-y-2">
      <p className="font-medium">Convert your bytes into reverse order</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="bytes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bytes</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Button type="submit">Calculate</Button>
        </form>
      </Form>
      <Label>Reverse Byte</Label>
      <Input type="text" value={byte} readOnly />
    </div>
  );
}

export default ReverseByteForm;
