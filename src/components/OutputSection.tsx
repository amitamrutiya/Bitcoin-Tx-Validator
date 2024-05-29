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
  form, outputsNumber, setOutputsNumber,
}: OutputsSectionProps) {
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
          <div className="flex items-center justify-between my-2">
            <FormField
              control={form.control}
              name={`outputs.${index}.amount`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Value</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" className="w-[150px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name={`outputs.${index}.scriptPubKey`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    {" "}
                    ScriptPubKey (ASM)
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" className="w-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name={`outputs.${index}.outputType`}
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
              )} />
          </div>
          <FormField
            control={form.control}
            name={`outputs.${index}.scriptPubKey`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">ScriptPubKey</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
        </div>
      ))}
      <Button type="button" onClick={handleAddOutput}>
        <Plus /> Add Output
      </Button>
    </div>
  );
}

export default OutputsSection;
