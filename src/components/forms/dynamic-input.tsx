import { UseFormRegister, FieldErrors } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  register?: UseFormRegister<any>;
  errors?: FieldErrors;
  element?: any;
  type?: "text" | "checkbox" | "number";
  placeholder?: string;
  className?: string
}

export const DynamicInput = ({
  label,
  name,
  register,
  errors,
  type = "text",
  placeholder = "",
  className=""
}: InputProps) => {
  const registerProps = register ? { ...register(name) } : {};

  if (type === "checkbox") {
    return (
      <div>
        <label className="flex items-center space-x-2">
          <input
            {...registerProps}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-base font-medium text-[#344054] font-onest">
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
        className={`input-control  ${
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