import { AddressSchema, addressSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
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
import { convertToBech32 } from "@/service/verifyAddress";

function Bech32() {
  const [address, setAddress] = useState<string>("");

  async function onSubmit(values: AddressSchema) {
    const bech32address = convertToBech32(values.hash, 0);
    setAddress(bech32address);
  }

  const form: UseFormReturn<AddressSchema> = useForm<AddressSchema>({
    mode: "all",
    resolver: zodResolver(addressSchema),
    defaultValues: {
      prefix: "00",
      hash: "",
    },
  });

  return (
    <div className="bg-secondary border-b-blue-500 border rounded-lg p-4 flex flex-col">
      <p className="text-md">
        Encode the locking script for a P2WPKH or a P2WSH to a segwit address.
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
                      <FormLabel className="font-normal">P2WPKH</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="05" />
                      </FormControl>
                      <FormLabel className="font-normal">P2WSH</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
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

export default Bech32;
