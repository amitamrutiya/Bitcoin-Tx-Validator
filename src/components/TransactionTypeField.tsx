import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "./ui/label";
import { useEffect, useRef } from "react";

type TransactionTypeFieldProps = {
  isSegwit: boolean;
  setIsSegwit: (value: boolean) => void;
};

function TransactionTypeField({
  setIsSegwit,
  isSegwit,
}: TransactionTypeFieldProps) {
  const defaultValues = isSegwit ? "segwit" : "legacy";
  return (
    <div className="flex gap-4">
      <p className=" text-sm font-bold"> Type</p>
      <RadioGroup
        defaultValue={defaultValues}
        className="flex"
        onValueChange={(value) => setIsSegwit(value === "segwit")}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="legacy" id="r1" checked={!isSegwit} />
          <Label htmlFor="r1">Legacy</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="segwit" id="r2" checked={isSegwit} />
          <Label htmlFor="r2">Segwit</Label>
        </div>
      </RadioGroup>
    </div>
  );
}

export default TransactionTypeField;
