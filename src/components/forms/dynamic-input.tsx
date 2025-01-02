import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import CurrencyInput from 'react-currency-input-field';

interface InputProps {
  label: string;
  name: string;
  register?: UseFormRegister<any>;
  errors?: FieldErrors;
  element?: any;
  type?: "text" | "checkbox" | "number" | "amount";
  placeholder?: string;
  className?: string
}

export const DynamicInput = ({
  label,
  name,
  register,
  errors,
  className,
  type = "text",
  placeholder = "",
}: InputProps) => {
  const registerProps = register ? { ...register(name) } : {};

  if (type === "amount") {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#344054] font-onest">
          {label}
        </label>
        <CurrencyInput
          {...registerProps}
          placeholder={placeholder}
          className={`input-control ${
            errors?.[name] ? "border-red-300" : "border-[#D0D5DD]"
          }`}
          decimalsLimit={2}
        />
        {errors?.[name] && (
          <p className="mt-1 text-sm text-red-600">
            {errors[name]?.message as string}
          </p>
        )}
      </div>
    );
  }

  if (type === "checkbox") {
    return (
      <div>
        <label className="flex items-center space-x-2">
          <input
            {...registerProps}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
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

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#344054] font-onest">
        {label}
      </label>
      <input
        {...registerProps}
        type={type}
        className={`input-control ${
          errors?.[name] ? "border-red-300" : "border-[#D0D5DD]"
        } ${className}`}
        placeholder={placeholder}
      />
      {errors?.[name] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};