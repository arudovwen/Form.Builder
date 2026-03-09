import { UseFormRegister, FieldErrors } from "react-hook-form";
import CurrencyInput from "react-currency-input-field";
import AppIcon from "../ui/AppIcon";

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
  watch?: any;
  min?: number;
  max?: number;
  description?: string;
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
  disabled,
  watch,
  min,
  max,
  description,
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
            setValue(name, value ?? null);
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
    const checkedValue = watch?.(name) || null;
    let isChecked = false;

    if (checkedValue) {
      if (checkedValue?.length && type === "checkbox") {
        isChecked = checkedValue?.includes(value);
      } else {
        isChecked = checkedValue == value;
      }
    }

    return (
      <div className="space-y-1">
        <label
          className={`flex  gap-3 cursor-pointer select-none ${description ? "items-start" : "items-center"}`}
        >
          <input
            {...registerProps}
            type={type}
            value={value || ""}
            disabled={disabled}
            className="peer sr-only"
          />

          <div
            className={`
            w-[18px] h-[18px] flex items-center justify-center
            border rounded-md transition-all duration-200
            ${errors?.[name] ? "border-red-300" : "border-[#D0D5DD]"}
            peer-checked:bg-[#7F56D9]
            peer-checked:border-[#7F56D9]
            peer-disabled:opacity-60
            peer-disabled:cursor-not-allowed
          `}
          >
            {isChecked && (
              <AppIcon
                icon="meteor-icons:check"
                iconClass="w-3.5 h-3.5 text-white"
              />
            )}
          </div>

          <div>
            <span className="text-sm leading-none block font-medium text-[#344054] font-onest">
              {label}
            </span>

            {description && (
              <span className="text-xs font-medium leading-none text-[#5c6c86] font-onest">
                {description}
              </span>
            )}
          </div>
        </label>

        {errors?.[name] && (
          <p className="ml-8 text-sm text-red-600">
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
        min={min}
        max={max}
      />
      {errors?.[name] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};
