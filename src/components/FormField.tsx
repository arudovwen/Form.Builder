import React, { useState, memo, useCallback } from "react";
import AppIcon from "@/components/AppIcon";
import clsx from "clsx";
import OtpInput from "react-otp-input";
import CurrencyInput from "react-currency-input-field";
import LockSvg from "@/assets/svgs/lockSvg";
import { UseFormRegister, UseFormSetValue, UseFormTrigger, FieldErrors } from "react-hook-form";

// Define more specific types for form control props
type FormControlProps = {
  register?: UseFormRegister<any>;
  setValue?: UseFormSetValue<any>;
  trigger?: UseFormTrigger<any>;
  errors?: FieldErrors<any>;
};

// Define the props interface with better type safety
interface FormFieldProps extends FormControlProps {
  label?: string;
  name: string;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'date' | 'time' | 'checkbox' | 'radio';
  className?: string;
  value?: string | number | boolean;
  isCheckbox?: boolean;
  isRadio?: boolean;
  isTextarea?: boolean;
  isCurrency?: boolean;
  maxW?: string;
  numInputs?: number;
  isOtp?: boolean;
  suffix?: React.ReactNode;
  disabled?: boolean;
  rows?: number;
  isFloatingLabel?: boolean;
  subText?: string;
  text?: string;
  labelClass?: string;
  prefix?: boolean;
  autoFocus?: boolean;
}

// Memoized input component to prevent unnecessary re-renders
const MemoizedInput = memo(({ 
  type, 
  className, 
  placeholder, 
  register, 
  name, 
  setValue, 
  value, 
  disabled, 
  autoFocus,
  isPasswordVisible 
}: {
  type: string;
  className: string;
  placeholder?: string;
  register?: UseFormRegister<any>;
  name: string;
  setValue?: UseFormSetValue<any>;
  value?: string | number;
  disabled?: boolean;
  autoFocus?: boolean;
  isPasswordVisible?: boolean;
}) => (
  <input
    className={className}
    placeholder={placeholder}
    {...(register ? register(name) : {})}
    onChange={(e) => setValue && setValue(name, e.target.value)}
    disabled={disabled}
    type={type === "password" && isPasswordVisible ? "text" : type}
    defaultValue={value}
    autoFocus={autoFocus}
  />
));

MemoizedInput.displayName = 'MemoizedInput';

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  placeholder,
  icon,
  type = "text",
  className = "",
  register,
  value = "",
  errors,
  isCheckbox = false,
  isRadio = false,
  isTextarea = false,
  isCurrency,
  maxW = "",
  isOtp = false,
  numInputs = 6,
  setValue,
  trigger,
  suffix,
  disabled,
  isFloatingLabel = false,
  subText,
  text,
  rows = 4,
  labelClass = "text-[10px]",
  prefix,
  autoFocus,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(prev => !prev);
  }, []);

  const merged = clsx(
    `input ${type === "time" || type === "date" ? "!pr-3" : ""}`,
    className
  );

  const renderInput = () => {
    if (isCheckbox) {
      return (
        <label className="text-sm text-[#414651] darks:text-white/70 flex gap-x-2 items-start whitespace-nowrap">
          <input
            className={`${merged} w-auto mt-1 accent-primary`}
            type="checkbox"
            defaultChecked={value as boolean}
            {...(register ? register(name) : {})}
            disabled={disabled}
          />
          <div>
            <span className="block">{label}</span>
            {text && <span className="block text-[10px] text-[#98A2B3]">{text}</span>}
          </div>
        </label>
      );
    }

    if (isRadio) {
      return (
        <label className="text-sm text-[#686878] flex gap-x-2 items-start">
          <input
            className={`${merged} w-auto mt-1`}
            type="radio"
            disabled={disabled}
            {...(register ? register(name) : {})}
          />
          <div>
            <span className="block">{label}</span>
            {text && <span className="block text-[10px] text-[#98A2B3]">{text}</span>}
          </div>
        </label>
      );
    }

    if (isTextarea) {
      return (
        <textarea
          className={clsx(merged, "resize-none")}
          placeholder={placeholder}
          {...(register ? register(name) : {})}
          rows={rows}
          defaultValue={value}
          disabled={disabled}
          autoFocus={autoFocus}
        />
      );
    }

    if (isCurrency) {
      return (
        <CurrencyInput
          id={name}
          name={name}
          placeholder={placeholder}
          value={value as string}
          decimalsLimit={2}
          disabled={disabled}
          onValueChange={(value) => {
            setValue?.(name, value);
            trigger?.(name);
          }}
          className={`${merged} w-auto mt-1`}
        />
      );
    }

    if (isOtp) {
      return (
        <OtpInput
          value={value as string}
          onChange={(val) => {
            register?.(name);
            setValue?.(name, val);
            trigger?.(name);
          }}
          numInputs={numInputs}
          renderSeparator={<span> </span>}
          containerStyle="flex gap-x-1 justify-between w-full"
          inputStyle="input !w-12 h-12 !p-1 w-full"
          renderInput={(props) => <input {...props} />}
        />
      );
    }

    return (
      <MemoizedInput
        type={type}
        className={`${merged} ${prefix ? "!pl-10 !pr-3" : ""}`}
        placeholder={placeholder}
        register={register}
        name={name}
        setValue={setValue}
        value={value as string}
        disabled={disabled}
        autoFocus={autoFocus}
        isPasswordVisible={isPasswordVisible}
      />
    );
  };

  return (
    <div className={`w-full relative flex flex-col gap-y-2 ${maxW}`}>
      <div className="w-full">
        {!isFloatingLabel && label && !isCheckbox && !isRadio && !isTextarea && (
          <label className="block text-sm text-[#414651] font-medium darks:text-white/70 mb-2">
            {label}
          </label>
        )}
        
        {!isFloatingLabel && label && isTextarea && (
          <label className="block text-sm text-[#414651] font-medium darks:text-white/70 mb-2">
            {label}
          </label>
        )}

        <div className="flex items-center relative">
          {isFloatingLabel && (
            <label
              className={`z-[40] absolute block text-[#414651] bg-white py-[2px] px-1 -top-[10px] left-3 ${labelClass}`}
            >
              {label}
            </label>
          )}
          
          {renderInput()}

          {icon && (
            <span
              className={clsx(
                "h-[16px] absolute",
                prefix ? "left-4" : "right-4",
                "text-secondary darks:text-white",
                type === "password" && "top-1/2 transform -translate-y-1/2"
              )}
            >
              {type === "password" ? (
                <button
                  className="text-secondary darks:text-white"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  <LockSvg />
                </button>
              ) : (
                <span className="text-sm">{icon}</span>
              )}
            </span>
          )}
        </div>
      </div>
      
      {!errors && subText && (
        <p className="text-[10px] text-[#98A2B3] leading-normal">{subText}</p>
      )}
      {errors && <span className="text-sm text-red-500">{errors.message}</span>}
    </div>
  );
};

export default memo(FormField); 