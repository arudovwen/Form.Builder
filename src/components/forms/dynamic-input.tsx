import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  element?: any;
  type?: "text" | "checkbox" | "number";
  placeholder?: string;
}

export const DynamicInput = ({
  label,
  name,
  register,
  errors,
  type = "text",
  placeholder = "",
}: InputProps) => {
  if (type === "checkbox") {
    return (
      <div>
        <label className="flex items-center space-x-2">
          <input
            {...register(name)}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm font-medium text-[#344054] font-onest">
            {label}
          </span>
        </label>{" "}
        {errors[name] && (
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
        {...register(name)}
        type={type}
        className={`input-control ${
          errors[name] ? "border-red-300" : "border-[#D0D5DD]"
        }`}
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};
