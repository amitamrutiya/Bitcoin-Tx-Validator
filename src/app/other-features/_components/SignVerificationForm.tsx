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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { verifySignature } from "@/service/utils";
import { SignatureSchema, signatureSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

function SignVerificationForm() {
  const [isValidSig, setIsValidSig] = useState<boolean | undefined>(undefined);
  const form: UseFormReturn<SignatureSchema> = useForm<SignatureSchema>({
    mode: "all",
    resolver: zodResolver(signatureSchema),
    defaultValues: {
      message: "",
      signature: "",
      publicKey: "",
    },
  });

  async function onSubmit(values: SignatureSchema) {
    const result = verifySignature(
      values.message,
      values.signature,
      values.publicKey
    );
    setIsValidSig(result);
  }

  return (
    <div className="bg-secondary border-b-blue-500 border rounded-lg p-4 flex flex-col space-y-2">
      <p className="font-medium">
        Verify a signature using the hash of a message and a public key.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            name="message"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message Hash</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Message" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="signature"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>DER Encoded Signature</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Signature" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="publicKey"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Public Key </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Public Key" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Verify Signature</Button>
        </form>
      </Form>
      <Separator />
      {isValidSig !== undefined && (
        <div className="flex items-center space-x-2">
          <p
            className={`font-medium ${
              isValidSig ? "text-destructive" : "text-green-600"
            }`}
          >
            Signature is {isValidSig ? "valid" : "invalid"}
          </p>
        </div>
      )}
    </div>
  );
}

export default SignVerificationForm;
