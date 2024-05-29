import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { UseFormReturn } from "react-hook-form";
import { TransactionSchema } from "@/utils/schema";
import { Input } from "./ui/input";

type TransactionMarkerFlagProps = {
  form: UseFormReturn<TransactionSchema>;
};

function TransactionMarkerFlag({ form }: TransactionMarkerFlagProps) {
  return (
    <div className="flex gap-10">
      <FormField
        control={form.control}
        name="marker"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Marker</FormLabel>
            <FormControl>
              <Input {...field} type="text" className="w-[100px]" disabled />
            </FormControl>
            <FormMessage className="text-muted-foreground text-xs">
              Marker must be 0x00
            </FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="flag"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Flag</FormLabel>
            <FormControl>
              <Input {...field} type="text" className="w-[100px]" disabled />
            </FormControl>
            <FormMessage className="text-muted-foreground text-xs">
              Flag must be 0x01
            </FormMessage>
          </FormItem>
        )}
      />
    </div>
  );
}

export default TransactionMarkerFlag;
