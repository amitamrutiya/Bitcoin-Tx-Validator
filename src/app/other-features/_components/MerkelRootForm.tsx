
import { getMerkeRoot } from "@/actions/getMerkelRoot";
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
import { MerkleRootSchema, merkleRootSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";

function MerkelRootForm() {
  const [txid, setTxid] = useState<string[]>([]);
  const form: UseFormReturn<MerkleRootSchema> = useForm<MerkleRootSchema>({
    mode: "all",
    resolver: zodResolver(merkleRootSchema),
  });

  const [merkerRoot, setMerkerRoot] = useState<string>("");
  async function onSubmit() {
    const merkleRoot = await getMerkeRoot(txid);
    setMerkerRoot(merkleRoot ?? "");
  }
  return (
    <div className="bg-secondary border-b-blue-500 border rounded-lg p-4 flex flex-col">
      <p className="text-md">Calculate the merkle root from a list of TXIDs.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name={"txids"}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold"> List of TXIDs</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    onChange={(e) => {
                      const txidsArray = e.target.value.split(",");
                      form.setValue("txids", txidsArray, {
                        shouldValidate: true,
                      });
                      setTxid(txidsArray);
                    }}
                  />
                </FormControl>
                <FormMessage className="text-muted-foreground text-xs">
                  A list of TXIDs separated by spaces, commas, or new lines.
                  Quotes and brackets are ignored.
                  <br />
                  <br />
                  The TXIDs should be input in reverse byte order (as they
                  appear on blockchain explorers), but they are converted to
                  natural byte order before the merkle root is calculated.{" "}
                </FormMessage>
              </FormItem>
            )}
          />
          <p className="font-bold">Your enterd TXIDs</p>
          <Textarea defaultValue={txid.join("\n")} readOnly />
          <Button type="submit">Calculate</Button>
        </form>
      </Form>
      <Label className="font-bold my-2">Merkle Root (Natural Byte Order)</Label>
      <Input type="text" placeholder="Root" value={merkerRoot} />
    </div>
  );
}

export default MerkelRootForm;
