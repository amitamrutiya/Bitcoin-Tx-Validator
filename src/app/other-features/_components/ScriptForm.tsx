import { getHexFromAsm } from "@/actions/getHexFromAsm";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScriptSchema, scriptSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";

function ScriptForm() {
  const [hex, setHex] = useState<string>("");
  const form: UseFormReturn<ScriptSchema> = useForm<ScriptSchema>({
    mode: "all",
    resolver: zodResolver(scriptSchema),
  });
  async function onSubmit(value: ScriptSchema) {
    try {
      const data = await getHexFromAsm(value.asm);
      setHex(data!.hex);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-secondary border-b-blue-500 border rounded-lg p-4 flex flex-col">
      <p className="text-md">Encode your script from ASM to Hex</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="asm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ASM</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Button type="submit">Calculate</Button>
        </form>
      </Form>

      <Label className="font-bold my-2">Hex</Label>
      <Input type="text" value={hex} />
    </div>
  );
}

export default ScriptForm;
