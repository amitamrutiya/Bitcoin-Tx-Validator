"use client";

import React, { useState } from "react";
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
import { ChevronDown, Plus, X } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  TransactionDefaultValues,
  transactionSchema,
  TransactionSchema,
} from "@/utils/schema";

function TransactionForm() {
  const form = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema),
    defaultValues: TransactionDefaultValues,
  });

  const { watch } = form;

  function onSubmit(values: TransactionSchema) {
    console.log(values);
  }

  const [position, setPosition] = useState("Non-Standard");
  const [inputs, setInputs] = useState(["Input-0"]);
  const [outputs, setOutputs] = useState(["Output-0"]);

  const handleAddInput = () => {
    setInputs([...inputs, `Input-${inputs.length}`]);
  };

  const handleRemoveInput = (input: string) => {
    setInputs(inputs.filter((i) => i !== input));
  };

  const handleAddOutput = () => {
    setOutputs([...outputs, `Output-${outputs.length}`]);
  };

  const handleRemoveOutput = (output: string) => {
    setOutputs(outputs.filter((o) => o !== output));
  };

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
          {watch("type") === "Segwit" && (
            <div className="flex gap-10">
              <FormField
                control={form.control}
                name="marker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Marker</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="w-[100px]"
                        disabled
                      />
                    </FormControl>
                    <FormMessage className="text-muted-foreground text-xs">
                      Marker must be 0x00
                    </FormMessage>{" "}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Flag</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="w-[100px]"
                        disabled
                      />
                    </FormControl>
                    <FormMessage className="text-muted-foreground text-xs">
                      Flag must be 0x01
                    </FormMessage>{" "}
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="flex flex-col space-y-2">
            <p className="text-3xl font-bold">Input {inputs.length}</p>
            {inputs.map((input, index) => (
              <>
                <div className="border border-primary rounded-md flex flex-col space-y-2 p-2">
                  <div>
                    <span className="text-muted-foreground">{input}</span>
                    <Button
                      type="button"
                      className="float-right"
                      size="icon"
                      onClick={() => handleRemoveInput(input)}
                    >
                      <X />
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name={`inputs.${index}.txid`}
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
                    name={`inputs.${index}.vout`}
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
                    name={`inputs.${index}.scriptSig`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          ScriptSig (ASM)
                        </FormLabel>
                        <FormControl>
                          <Textarea className="resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`inputs.${index}.sequence`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Sequence</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            className="w-[150px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watch("type") === "Segwit" && (
                    <FormField
                      control={form.control}
                      name={`inputs.${index}.witness`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">
                            Input 0 Witness Field (Stack Items)
                          </FormLabel>
                          <FormControl>
                            <Textarea className="resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </>
            ))}
            <Button variant="outline" onClick={handleAddInput} type="button">
              Add Input <Plus className="h-4 w-4 ml-3 text-muted-foreground" />
            </Button>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="text-3xl font-bold">Output {outputs.length}</p>
            {outputs.map((output, index) => (
              <>
                <div className="border border-primary rounded-md flex flex-col space-y-2 p-2">
                  <div>
                    <span className="text-muted-foreground">{output}</span>
                    <Button
                      type="button"
                      className="float-right"
                      size="icon"
                      onClick={() => handleRemoveOutput(output)}
                    >
                      <X />
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name={`outputs.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          Amount (satoshis)
                        </FormLabel>
                        <FormControl>
                          <Input
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
                    name={`outputs.${index}.scriptPubKey`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" font-bold">
                          ScriptPubKey (ASM)
                        </FormLabel>
                        <FormControl>
                          <Textarea className="resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`outputs.${index}.outputType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <DropdownMenu {...field}>
                            <DropdownMenuTrigger asChild className="w-72 my-2">
                              <Button variant="outline">
                                {position}
                                <ChevronDown />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-96">
                              <DropdownMenuLabel>Output Type</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuRadioGroup
                                value={position}
                                onValueChange={setPosition}
                              >
                                <DropdownMenuRadioItem value="Non-Standard">
                                  Non-Standard
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="P2PK">
                                  P2PK
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="P2PKH">
                                  P2PKH
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="P2MS">
                                  P2MS
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="P2SH">
                                  P2SH
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="P2WPKH">
                                  P2WPKH
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="P2WPSH">
                                  P2WPSH
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="P2TR">
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
              </>
            ))}
            <Button variant="outline" type="button" onClick={handleAddOutput}>
              Add Output <Plus className="h-4 w-4 ml-3 text-muted-foreground" />
            </Button>
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
      <Separator className="bg-primary my-4" />
      <p className="text-3xl font-bold">Raw Transaction Data</p>
      <Textarea className="resize-none my-3" />
    </div>
  );
}

export default TransactionForm;
