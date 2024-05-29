import React from "react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { inputDefaultValues, TransactionSchema } from "@/utils/schema";
import { UseFormReturn } from "react-hook-form";

type InputsSectionProps = {
  form: UseFormReturn<TransactionSchema>;
  inputsNumber: number[];
  setInputsNumber: (value: number[]) => void;
};

function InputsSection({
  form,
  inputsNumber,
  setInputsNumber,
}: InputsSectionProps) {
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

  const { watch } = form;

  return (
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
                    <Input {...field} type="number" className="w-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="my-3 border border-accent-foreground rounded-md px-3 py-2">
            <p>Previous Output</p>
            <FormField
              control={form.control}
              name={`inputs.${index}.prevout.scriptPubKey`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    ScriptPubKey (ASM)
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-around my-2">
              <FormField
                control={form.control}
                name={`inputs.${index}.prevout.amount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      Amount (Satoshi)
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
                name={`inputs.${index}.prevout.outputType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Type</FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-[150px] justify-between"
                        >
                          {field.value} <ChevronDown />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <DropdownMenuRadioItem value="P2PKH">
                            P2PKH
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="P2SH">
                            P2SH
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="P2WPKH">
                            P2WPKH
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="P2WSH">
                            P2WSH
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
          <FormField
            control={form.control}
            name={`inputs.${index}.sequence`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Sequence</FormLabel>
                <FormControl>
                  <Input {...field} type="number" className="w-[150px]" />
                </FormControl>
                <FormMessage className="text-muted-foreground text-xs">
                  By default, the sequence is 0xffffffff.
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
      ))}
      <Button type="button" onClick={handleAddInput}>
        <Plus /> Add Input
      </Button>
    </div>
  );
}

export default InputsSection;
