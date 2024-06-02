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
import { Textarea } from "@/components/ui/textarea";
import { parseDer, reverseBytes } from "@/service/utils";
import { parseDerSchema, ParseDerSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

function ParseDerForm() {
  const [r, setr] = useState<bigint>();
  const [s, sets] = useState<bigint>();
  const form: UseFormReturn<ParseDerSchema> = useForm<ParseDerSchema>({
    mode: "all",
    resolver: zodResolver(parseDerSchema),
    defaultValues: {
      signature: "",
    },
  });

  function onSubmit(data: ParseDerSchema) {
    type signature = {
      r: bigint;
      s: bigint;
    };
    const returnSig: signature = parseDer(data.signature);
    setr(returnSig.r);
    sets(returnSig.s);
  }
  return (
    <div className="bg-secondary border-b-blue-500 border rounded-lg p-4 flex flex-col space-y-2">
      <p className="font-medium">
        Convert a raw ECDSA signature from the DER-encoded signature found in
        scriptSigs.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="signature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raw Signature</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Button type="submit">Calculate</Button>
        </form>
      </Form>
      <Label>Signature</Label>
      <div className="flex items-center gap-2">
        <p>R:</p>
        <Input type="text" value={r ? r.toString() : ""} readOnly />
      </div>
      <div className="flex items-center gap-2">
        <p>S:</p>
        <Input type="text" value={s ? s.toString() : ""} readOnly />
      </div>
    </div>
  );
}

export default ParseDerForm;
