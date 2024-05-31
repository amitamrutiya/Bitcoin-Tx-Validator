"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionDefaultValues } from "@/utils/schema";
import MerkelRootForm from "./_components/MerkelRootForm";

function OtherFeature() {
  return (
    <div className="min-h-screen flex justify-center items-center text-white w-screen">
      <Accordion
        type="single"
        collapsible
        className="w-2/3 border p-5 rounded-md"
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
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It&apos;s animated by default, but you can disable it if you
            prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default OtherFeature;
