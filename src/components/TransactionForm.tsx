import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  inputDefaultValues,
  outputDefaultValues,
  TransactionDefaultValues,
  transactionSchema,
  TransactionSchema,
} from "@/utils/schema";

function TransactionForm() {
  const form = useForm<TransactionSchema>({
    mode: "all",
    resolver: zodResolver(transactionSchema),
    defaultValues: TransactionDefaultValues,
  });

  const { watch } = form;

  function onSubmit(values: TransactionSchema) {
    console.log(values.inputs);
    watch("inputs").forEach((input) => {
      console.log(input);
    });
  }

  const [inputsNumber, setInputsNumber] = useState([0]);
  const [outputsNumber, setOutputsNumber] = useState([0]);

  const handleAddInput = () => {
    setInputsNumber([...inputsNumber, inputsNumber.length]);
    form.setValue(`inputs.${inputsNumber.length}`, inputDefaultValues);
  };

  const handleRemoveInput = (index: number) => {
    setInputsNumber(inputsNumber.filter((_, i) => i !== index));
    form.setValue(
      `inputs`,
      form.getValues("inputs").filter((_, i) => i !== index)
    );
  };

  const handleAddOutput = () => {
    setOutputsNumber([...outputsNumber, outputsNumber.length]);
    form.setValue(`outputs.${outputsNumber.length}`, outputDefaultValues);
  };

  const handleRemoveOutput = (index: number) => {
    setOutputsNumber(outputsNumber.filter((_, i) => i !== index));
    form.setValue(
      `outputs`,
      form.getValues("outputs").filter((_, i) => i !== index)
    );
  };

  return (
    <div className="bg-secondary border-b-blue-500 border rounded-lg px-5 py-5 flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                    </FormMessage>
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
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="flex flex-col space-y-2">
            <p className="text-3xl font-bold">Input {inputsNumber.length}</p>
            {inputsNumber.map((index) => (
              <div
                className="border-primary border-2 p-2 rounded-md"
                key={`inputs.${index}`}
              >
                <div>
                  <span className="text-muted-foreground">{`input: ${index}`}</span>
                  {index !== 0 && (
                    <Button
                      type="button"
                      className="float-right"
                      size="icon"
                      onClick={() => handleRemoveInput(index)}
                    >
                      <X />
                    </Button>
                  )}
                </div>
                <div className="flex gap-10">
                  <FormField
                    control={form.control}
                    name={`inputs.${index}.txid`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Txid</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" className="w-[400px]" />
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
                            {...field}
                            type="number"
                            className="w-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`inputs.${index}.scriptSig`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">ScriptSig</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
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
                        <Input {...field} type="number" className="w-[150px]" />
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
                        <FormLabel className="font-bold">Witness</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            ))}
            <Button type="button" onClick={handleAddInput}>
              <Plus /> Add Input
            </Button>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="text-3xl font-bold">Output {outputsNumber.length}</p>
            {outputsNumber.map((index) => (
              <div
                className="border-primary border-2 p-2 rounded-md"
                key={`outputs.${index}`}
              >
                <div>
                  <span className="text-muted-foreground">{`Output: ${index}`}</span>
                  {index !== 0 && (
                    <Button
                      type="button"
                      className="float-right"
                      size="icon"
                      onClick={() => handleRemoveOutput(index)}
                    >
                      <X />
                    </Button>
                  )}
                </div>
                <FormField
                  control={form.control}
                  name={`outputs.${index}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Amount</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" className="w-[150px]" />
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
                      <FormLabel className="font-bold">ScriptPubKey (ASM)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
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
                      <FormLabel className="font-bold">Output Type</FormLabel>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className="w-[200px] justify-between ml-5"
                              variant="outline"
                            >
                              {field.value || "Select output type"}
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[200px] p-0">
                            <DropdownMenuLabel>Output Type</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
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
            ))}
            <Button type="button" onClick={handleAddOutput}>
              <Plus /> Add Output
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
