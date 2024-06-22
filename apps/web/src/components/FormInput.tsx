import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { Input, InputProps } from "./ui/input";
import { Label } from "./ui/label";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type: "text" | "number";
  placeholder: string;
} & Omit<InputProps, "name">;

export function FormInput<T extends FieldValues>({
  name,
  label,
  type,
  placeholder,
  ...props
}: Props<T>) {
  const { control } = useFormContext();

  const handleOnChange = (
    onChange: (value: any) => void,
    type: string,
    value: string,
  ) => {
    if (type === "number") {
      const parsedValue = parseFloat(value);
      onChange(isNaN(parsedValue) ? undefined : Math.max(parsedValue, 0));
    } else {
      onChange(value);
    }
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, value, ...field },
          fieldState: { error },
        }) => (
          <>
            <Input
              {...field}
              {...props}
              type={type}
              placeholder={placeholder}
              value={
                type === "number"
                  ? value === undefined
                    ? 0
                    : value
                  : value || ""
              }
              onChange={(e) => handleOnChange(onChange, type, e.target.value)}
              className={`mr-4 ${error ? "border-red-500" : ""}`}
            />
            <div className="mt-1 text-xs text-red-500">
              {error && <p>{error.message}</p>}
            </div>
          </>
        )}
      />
    </div>
  );
}
