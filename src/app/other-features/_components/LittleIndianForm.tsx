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
import { Label } from "@/components/ui/label";
import { toBigEndian, toLittleEndian } from "@/service/utils";
import { LittleIndianSchema, littleIndianSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

function LittleIndianForm() {
  const [bigByte, setBigByte] = useState<string>("");
  const [littleByte, setLittleByte] = useState<string>("");
  const form: UseFormReturn<LittleIndianSchema> = useForm<LittleIndianSchema>({
    mode: "all",
    resolver: zodResolver(littleIndianSchema),
  });

  function onSubmit(data: LittleIndianSchema) {
    const num = BigInt(data.num);
    setBigByte(toBigEndian(num));
    setLittleByte(toLittleEndian(num));
  }
  return (
    <div className="bg-secondary border-b-blue-500 border rounded-lg p-4 flex flex-col space-y-2">
      <p className="font-medium">
        Convert numbers to big-endian and little-endian byte orders.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="num"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bytes</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Button type="submit">Calculate</Button>
        </form>
      </Form>
      <Label>Hex Bytes (Big Endian)</Label>
      <Input type="text" value={bigByte} readOnly />
      <Label>Hex Bytes (Little Endian)</Label>
      <Input type="text" value={littleByte} readOnly />
    </div>
  );
}

export default LittleIndianForm;
