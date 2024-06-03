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
import Base58 from "./_components/Base58Form";
import Bech32 from "./_components/Bech32Form";
import Hash256 from "./_components/Hash256Form";
import Hash160 from "./_components/Hash160Form";
import Sha256 from "./_components/Sha256Form";
import Rimped160 from "./_components/Rimped160Form";
import SignVerificationForm from "./_components/SignVerificationForm";
import ReverseByteForm from "./_components/ReverseByteForm";
import LittleIndianForm from "./_components/LittleIndianForm";
import UnixTimeForm from "./_components/UnixTimeForm";
import ParseDerForm from "./_components/ParseDerForm";

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
              loading={false}
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
        <AccordionItem value="item-9">
          <AccordionTrigger>Hash160</AccordionTrigger>
          <AccordionContent>
            <Hash160 />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-10">
          <AccordionTrigger>SHA256</AccordionTrigger>
          <AccordionContent>
            <Sha256 />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-11">
          <AccordionTrigger>Rimped160</AccordionTrigger>
          <AccordionContent>
            <Rimped160 />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-12">
          <AccordionTrigger>Signature Verification</AccordionTrigger>
          <AccordionContent>
            <SignVerificationForm />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-13">
          <AccordionTrigger>DER Signature</AccordionTrigger>
          <AccordionContent>
            <ParseDerForm />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-14">
          <AccordionTrigger>Reverse Byte</AccordionTrigger>
          <AccordionContent>
            <ReverseByteForm />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-15">
          <AccordionTrigger>Little Indian</AccordionTrigger>
          <AccordionContent>
            <LittleIndianForm />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-16">
          <AccordionTrigger>Unix Time</AccordionTrigger>
          <AccordionContent>
            <UnixTimeForm />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default OtherFeature;
