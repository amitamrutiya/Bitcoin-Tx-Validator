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
import { reverseBytes } from "@/service/utils";
import {
  ReverseBytesSchema,
  reverseBytesSchema,
  UnixTimeSchema,
  unixTimeSchema,
} from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

function UnixTimeForm() {
  const [time, setTime] = useState<string>("");
  const form: UseFormReturn<UnixTimeSchema> = useForm<UnixTimeSchema>({
    mode: "all",
    resolver: zodResolver(unixTimeSchema),
    defaultValues: {
      unixTime: 0,
    },
  });

  function onSubmit(data: UnixTimeSchema) {
    const date = new Date(data.unixTime * 1000);
    setTime(date.toUTCString());
  }

  return (
    <div className="bg-secondary border-b-blue-500 border rounded-lg p-4 flex flex-col space-y-2">
      <p className="font-medium">
        Convert the number of seconds since 1 Jan 1970, 00:00:00 to a date.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="unixTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unix Time</FormLabel>
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
      <Label>Date</Label>
      <Input type="text" value={time} readOnly />
    </div>
  );
}

export default UnixTimeForm;
