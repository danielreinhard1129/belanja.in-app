import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  datas: Option[];
};

export function FormSelectStore<T extends FieldValues>({
  name,
  label,
  datas,
}: Props<T>) {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col space-y-1.5">
      <Controller
        control={control}
        name={name}
        render={({
          field: { value, onChange, ref },
          fieldState: { error },
        }) => (
          <>
            <Select onValueChange={(val) => onChange(val)}>
              <SelectTrigger
                className={`w-full ${error ? "border-red-500" : ""}`}
                ref={ref}
              >
                <SelectValue
                  placeholder={
                    value
                      ? datas.find((option) => option.value === value)?.label
                      : `Select ${label}`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label}</SelectLabel>
                  {datas && datas.length > 0 ? (
                    datas.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="no-options">
                      No options available
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="mt-1 text-xs text-red-500">
              {error && <p>{error.message}</p>}
            </div>
          </>
        )}
      />
    </div>
  );
}
