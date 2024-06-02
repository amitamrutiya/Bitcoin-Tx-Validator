import { AddressSchema, addressSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm, UseFormReturn, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { generateLegacyAddress } from "@/service/verifyAddress";

function Base58() {
  const [address, setAddress] = useState<string>("");

  async function onSubmit(values: AddressSchema) {
    const base58address = generateLegacyAddress(
      values.hash,
      parseInt(values.prefix, 16)
    );

    setAddress(base58address);
  }

  const form: UseFormReturn<AddressSchema> = useForm<AddressSchema>({
    mode: "all",
    resolver: zodResolver(addressSchema),
    defaultValues: {
      prefix: "00",
      hash: "",
    },
  });

  const { watch } = form;
  return (
    <div className="bg-secondary border-b-blue-500 border rounded-lg p-4 flex flex-col">
      <p className="text-md">
        Encode the hash160 of public key or script to a legacy address.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="prefix"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-y-1 mt-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="00" />
                      </FormControl>
                      <FormLabel className="font-normal">P2PKH</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="05" />
                      </FormControl>
                      <FormLabel className="font-normal">P2SH</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="6f" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        P2PKH (Testnet)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="c4" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        P2SH (Testnet)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <div className="flex gap-4 items-center">
                  <FormLabel>Prefix</FormLabel>
                  <Input
                    {...field}
                    className="w-11"
                    value={watch("prefix")}
                    readOnly
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="hash"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel>Hash</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    placeholder="Enter the hash"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Calculate</Button>
        </form>
      </Form>
      <div className="flex gap-3 items-center">
        <Label>Address</Label>
        <Input className="" value={address} readOnly />
      </div>
    </div>
  );
}

export default Base58;
