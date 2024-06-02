"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionDefaultValues } from "@/utils/schema";
import MerkelRootForm from "./_components/MerkelRootForm";
import TxidForm from "./_components/TxidForm";
import ScriptForm from "./_components/ScriptForm";
import { Button } from "@/components/ui/button";
import { ChevronLeftCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Base58 from "./_components/Base58";
import Bech32 from "./_components/Bech32";
import Hash256 from "./_components/Hash256";

function OtherFeature() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-white w-screen gap-8">
      <Button className="gap-2" onClick={() => router.back()}>
        <ChevronLeftCircle /> GO Back
      </Button>
      <Accordion
        type="single"
        collapsible
        className="max-w-[800px] w-2/3 border p-5 rounded-md"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Serialize transaction</AccordionTrigger>
          <AccordionContent>
            <TransactionForm
              defaultValues={TransactionDefaultValues}
              checkValid={false}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Merkel Root</AccordionTrigger>
          <AccordionContent>
            <MerkelRootForm />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>TXID</AccordionTrigger>
          <AccordionContent>
            <TxidForm type={"txid"} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>wTXID</AccordionTrigger>
          <AccordionContent>
            <TxidForm type={"wtxid"} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>Script</AccordionTrigger>
          <AccordionContent>
            <ScriptForm />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>Address (Base58)</AccordionTrigger>
          <AccordionContent>
            <Base58 />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger>Address (Bech32)</AccordionTrigger>
          <AccordionContent>
            <Bech32 />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-8">
          <AccordionTrigger>Hash256</AccordionTrigger>
          <AccordionContent>
            <Hash256 />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default OtherFeature;
