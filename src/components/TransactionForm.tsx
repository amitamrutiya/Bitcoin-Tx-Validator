"use client";

import React from "react";
import { z } from "zod";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";


const formSchema = z.object({
  type: z.enum(["Legacy", "Segwit"], {
    required_error: "You need to select a one type of transaction",
  }),
  version: z
    .number()
    .int()
    .min(1)
    .max(2)
    .refine((value) => value >= 1 && value <= 2, {
      message: "Version numbers greater than 2 are not yet in use.",
    }),
  txid: z
    .string()
    .min(64)
    .max(64)
    .refine((value) => /^[0-9a-fA-F]+$/.test(value), {
      message: "Txid must be a valid hexadecimal string.",
    }),
  vout: z.number().int().min(0),
  scriptSig: z.string().min(2),
  sequence: z.number().int().min(0),
  amount: z.number().int().min(0),
  scriptPubKey: z.string().min(2),
  outputType: z.enum(
    ["p2pk", "p2pkh", "p2ms", "p2sh", "p2wpkh", "p2wpsh", "p2tr"],
    {
      required_error: "You need to select a one type of output",
    }
  ),
  locktime: z.number().int().min(0),
});

function TransactionForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "Legacy",
      version: 1,
      txid: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      vout: 0,
      scriptSig: "",
      sequence: 4294967294,
      amount: 0,
      scriptPubKey: "",
      outputType: undefined,
      locktime: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const [position, setPosition] = React.useState("bottom");

  return (
    <div className="bg-secondary border-b-blue-500  border rounded-lg px-5 py-5 flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-1 w-min">
                <FormLabel className="font-bold">Type</FormLabel>
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
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Version</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1"
                    {...field}
                    type="number"
                    className="w-[200px]"
                  />
                </FormControl>
                <FormMessage className="text-muted-foreground text-xs">
                  Version numbers greater than 2 are not yet in use.
                </FormMessage>{" "}
              </FormItem>
            )}
          />
          <div className="flex flex-col space-y-2">
            <p className="text-3xl font-bold">Input</p>
            <div className="border border-primary rounded-md flex flex-col space-y-2 p-2">
              <FormField
                control={form.control}
                name="txid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Txid</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Vout</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1"
                        {...field}
                        type="number"
                        className="w-[150px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scriptSig"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ScriptSig (ASM)</FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sequence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Sequence</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="w-[150px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="text-3xl font-bold">Output</p>
            <div className="border border-primary rounded-md flex flex-col space-y-2 p-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      Amount (satoshis)
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="w-[150px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scriptPubKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ScriptPubKey (ASM)</FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sequence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Sequence</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="w-[150px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="outputType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DropdownMenu {...field}>
                        <DropdownMenuTrigger asChild className="w-72 my-2">
                          <Button variant="outline">
                            Non-Standard <ChevronDown />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-96">
                          <DropdownMenuLabel>Output Type</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={position}
                            onValueChange={setPosition}
                          >
                            <DropdownMenuRadioItem value="p2pk">
                              P2PK
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="p2pkh">
                              P2PKH
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="p2ms">
                              P2MS
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="p2sh">
                              P2SH
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="p2wpkh">
                              P2WPKH
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="p2wpsh">
                              P2WPSH
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="p2tr">
                              P2TR
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="locktime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-3xl font-bold">Locktime</FormLabel>
                <FormControl>
                  <Input {...field} type="number" className="w-[200px]" />
                </FormControl>
                <FormMessage className="text-muted-foreground text-xs">
                  Block Height
                </FormMessage>{" "}
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default TransactionForm;
