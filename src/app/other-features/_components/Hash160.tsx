import { hashSchema, HashSchema } from "@/utils/schema";
import React, { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getHash160 } from "@/actions/hashaction";

function Hash160() {
  const [hash, setHash] = useState<string>("");
  async function onSubmit(values: HashSchema) {
    const hash = await getHash160(values.hash);
    setHash(hash);
  }

  const form: UseFormReturn<HashSchema> = useForm<HashSchema>({
    mode: "all",
    resolver: zodResolver(hashSchema),
    defaultValues: {
      hash: "",
    },
  });

  return (
    <div className="bg-secondary border-b-blue-500 border rounded-lg p-4 flex flex-col space-y-2">
      <p className="text-md">
        SHA-256 + RIPEMD-160. Used for shortening a public key or script before
        converting to an address.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="hash"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Hash</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <Button type="submit">Calculate</Button>
          </FormItem>
        </form>
      </Form>
      <p className="text-xs font-sans">SHA-256(RIPEMD-160(data))</p>
      <Input value={hash} readOnly />
    </div>
  );
}

export default Hash160;
