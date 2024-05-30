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
import { outputDefaultValues, TransactionSchema } from "@/utils/schema";
import { UseFormReturn } from "react-hook-form";

type OutputsSectionProps = {
  form: UseFormReturn<TransactionSchema>;
  outputsNumber: number[];
  setOutputsNumber: (value: number[]) => void;
};

function OutputsSection({
  form,
  outputsNumber,
  setOutputsNumber,
}: OutputsSectionProps) {
  const handleAddOutput = () => {
    setOutputsNumber([...outputsNumber, outputsNumber.length]);
    form.setValue(`vout.${outputsNumber.length}`, outputDefaultValues);
  };

  const handleRemoveOutput = (index: number) => {
    setOutputsNumber(outputsNumber.filter((_, i) => i !== index));
    form.setValue(
      `vout`,
      form.getValues("vout").filter((_, i) => i !== index)
    );
  };

  return (
    <div className="flex flex-col space-y-2">
      <p className="text-3xl font-bold">Output {outputsNumber.length}</p>
      {outputsNumber.map((index: number) => (
        <div
          className="border-primary border-2 p-2 rounded-md"
          key={`outputs.${index}`}
        >
          <div>
            <span className="text-muted-foreground">{`output: ${index}`}</span>
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
          <div className="flex sm:flex-row flex-col sm:items-center sm:justify-around my-2 gap-2">
            <FormField
              control={form.control}
              name={`vout.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Amount (Satoshi)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" className="w-[150px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`vout.${index}.scriptpubkey_type`}
              render={({ field }) => (
                <FormItem className="flex flex-col ">
                  <FormLabel className="font-bold">Output Type</FormLabel>
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
                        <DropdownMenuRadioItem value="Non-Standard">
                          Non-Standard
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="p2pk">
                          p2pk
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="p2pkh">
                          p2pkh
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="p2ms">
                          p2ms
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="p2sh">
                          p2sh
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="v0_p2wpkh">
                          v0_p2wpkh
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="p2wpsh">
                          p2wpsh
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="p2tr">
                          p2tr
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name={`vout.${index}.scriptpubkey_asm`}
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
            name={`vout.${index}.scriptpubkey_address`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  ScriptPubKey Address
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
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
  );
}

export default OutputsSection;
