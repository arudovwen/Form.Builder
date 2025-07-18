import { UseFormRegister, FieldErrors } from "react-hook-form";
import CurrencyInput from "react-currency-input-field";

interface InputProps {
  label: string;
  name: string;
  register?: UseFormRegister<any>;
  errors?: FieldErrors;
  element?: any;
  type?: "text" | "checkbox" | "number" | "amount" | "textarea";
  placeholder?: string;
  className?: string;
  isFloating?: boolean;
  setValue?: any;
  value?: any;
  trigger?: any;
  prefix?: string;
  disabled?: boolean;
}

export const DynamicInput = ({
  label,
  name,
  register,
  errors,
  className,
  type = "text",
  placeholder = "",
  isFloating,
  setValue,
  value,
  trigger,
  prefix,
  disabled
}: InputProps) => {
  const registerProps = register ? { ...register(name) } : {};

  if (type === "amount") {
    return (
      <div className="space-y-1.5 relative">
        <label
          className={`block text-sm font-medium text-[#344054] font-onest ${
            isFloating
              ? "z-[40] absolute block text-[#667085] bg-white  py-[2px] px-1 -top-[12px] left-3 "
              : "relative"
          }`}
        >
          {label}
        </label>
        <CurrencyInput
          onValueChange={(value: any) => {
            setValue(name, value);
            if (register) {
              register(name);
            }
            if (trigger) {
              trigger(name);
            }
          }}
          placeholder={placeholder}
          className={`field-control ${
            errors?.[name] ? "border-red-300" : "border-[#D0D5DD]"
          }`}
          decimalsLimit={2}
          value={value}
          prefix={prefix}
          disabled={disabled}
        />
        {errors?.[name] && (
          <p className="mt-1 text-sm text-red-600">
            {errors[name]?.message as string}
          </p>
        )}
      </div>
    );
  }

  if (["checkbox", "radio"].includes(type)) {
    return (
      <div>
        <label className="flex items-center space-x-2">
          <input
            {...registerProps}
            type={type}
            className="w-4 h-4 border-gray-300 rounded"
            value={value}
            disabled={disabled}
          />
          <span className="text-sm font-medium text-[#344054] font-onest">
            {label}
          </span>
        </label>
        {errors?.[name] && (
          <p className="ml-2 text-sm text-red-600">
            {errors[name]?.message as string}
          </p>
        )}
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="space-y-1.5 relative">
        <label
          className={`block text-sm font-medium text-[#344054] font-onest ${
            isFloating
              ? "z-[40] absolute block text-[#667085] bg-white  py-[2px] px-1 -top-[12px] left-3 "
              : "relative"
          }`}
        >
          {label}
        </label>
        <textarea
          {...registerProps}
          className={`field-control ${
            errors?.[name] ? "border-red-300" : "border-[#D0D5DD]"
          } ${className}`}
          placeholder={placeholder}
          disabled={disabled}
        />
        {errors?.[name] && (
          <p className="mt-1 text-sm text-red-600">
            {errors[name]?.message as string}
          </p>
        )}
      </div>
    );
  }
  return (
    <div className="space-y-1.5 relative w-full">
      <label
        className={`block text-sm font-medium text-[#344054] font-onest ${
          isFloating
            ? "z-[40] absolute block text-[#667085] bg-white  py-[2px] px-1 -top-[12px] left-3"
            : "relative"
        }`}
      >
        {label}
      </label>
      <input
        {...registerProps}
        type={type}
        className={`field-control ${
          errors?.[name] ? "border-red-300" : "border-[#D0D5DD]"
        } ${className}`}
        placeholder={isFloating ? "" : placeholder}
        disabled={disabled}
      />
      {errors?.[name] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};
