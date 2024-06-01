import { getTxid } from "@/actions/getTxid";
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
import { Textarea } from "@/components/ui/textarea";
import { TxidSchema, txidSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";

function TxidForm({ type }: { type: string }) {
  const [txid, setTxid] = useState<string>("");

  const form: UseFormReturn<TxidSchema> = useForm<TxidSchema>({
    mode: "all",
    resolver: zodResolver(txidSchema),
  });
  async function onSubmit(value: TxidSchema) {
    try {
      const data = await getTxid(value.rawTransaction);
      setTxid(data!.txid);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="bg-secondary border-b-blue-500 border rounded-lg p-4 flex flex-col">
      <p className="text-md">
        Create a {type === "txid" ? "txid" : "wtxid"} from raw transaction data.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="rawTransaction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raw Transaction Data</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={6} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <Button type="submit">Calculate</Button>
        </form>
      </Form>

      <Label className="font-bold my-2">
        {type === "txid"
          ? "TXID (Natural Byte Order)"
          : "WTXID(Natural Byte Order)"}
      </Label>
      <Input type="text" placeholder="Root" value={txid} />
    </div>
  );
}

export default TxidForm;
