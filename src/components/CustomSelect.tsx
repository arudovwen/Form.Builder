import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import AppIcon from "./ui/AppIcon";

interface Option {
  label: string;
  value: any;
}

interface CustomSelectProps {
  className?: string;
  options: any[];
  placeholder?: string;
  errors?: { message?: string };
  register?: any;
  setValue?: (name: string, value: any) => void;
  name: string;
  label?: string;
  value?: any;
  trigger?: (name: string) => void;
  isMultiple?: boolean;
  isFloatingLabel?: boolean;
  subText?: string;
  labelClass?: string;
  loading?: boolean;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options = [],
  placeholder = "Select",
  errors,
  register,
  setValue,
  name,
  label,
  value,
  trigger,
  isMultiple,
  isFloatingLabel,
  subText,
  labelClass = "text-[10px]",
  loading,
  disabled,
}) => {
  const [selected, setSelected] = useState<Option | Option[] | null>(isMultiple ? [] : null);
  const isUserChange = useRef(false);

  /** ----------------------------------------------
   *  Find matching option from external value
   * ---------------------------------------------- */
  const computedSelected = useMemo(() => {
    if (!value || !options || options.length === 0) return isMultiple ? [] : null;

    if (isMultiple) {
      // Handle multiple selection
      return Array.isArray(value)
        ? options.filter(o => value.some(v => 
            typeof o.value === "object" ? o.value?.id === v?.id : o.value === v
          ))
        : [];
    }

    // Single selection - find matching option
    return options.find((o) => {
      if (typeof o.value === "string" && typeof value === "string") {
        return o.value.toLowerCase() === value.toLowerCase();
      }
      if (typeof o.value === "object" && typeof value === "object") {
        return o.value?.id === value?.id;
      }
      return o.value === value;
    }) || null;
  }, [value, options, isMultiple]);

  /** Sync external value → internal state (avoid loops) */
  useEffect(() => {
    if (isUserChange.current) {
      isUserChange.current = false;
      return;
    }

    // Deep comparison for arrays
    if (isMultiple && Array.isArray(computedSelected) && Array.isArray(selected)) {
      const selectedValues = (selected as Option[])?.map(s => s.value);
      const computedValues: any = (computedSelected as Option[])?.map(s => s.value);
      
      if (JSON.stringify(selectedValues) !== JSON.stringify(computedValues)) {
        setSelected(computedSelected);
      }
    } else if ((computedSelected as any)?.value !== (selected as Option)?.value) {
      setSelected(computedSelected);
    }
  }, [computedSelected, isMultiple]);

  /** Handle selection change */
  const handleChange = useCallback((newValue: Option | Option[] | null) => {
    isUserChange.current = true;
    setSelected(newValue);

    if (setValue) {
      const formValue = isMultiple
        ? Array.isArray(newValue) ? newValue?.map(v => v.value) : []
        : (newValue as Option)?.value ?? null;

      setValue(name, formValue);
      trigger?.(name);
    }

    if (register && !isUserChange.current) {
      register(name);
    }
  }, [setValue, name, trigger, register, isMultiple]);

  /** Display text */
  const displayText = useMemo(() => {
    if (loading) return "Fetching data...";
    
    if (!selected) return placeholder;

    if (isMultiple && Array.isArray(selected)) {
      return selected.length > 0
        ? selected?.map(s => s.label).join(", ")
        : placeholder;
    }

    return (selected as Option)?.label || placeholder;
  }, [selected, loading, placeholder, isMultiple]);

  return (
    <div className="relative">
      {!isFloatingLabel && label && (
        <label className="block text-sm text-[#686878] darks:text-white/70 mb-2">
          {label}
        </label>
      )}

      {isFloatingLabel && label && (
        <label
          className={clsx(
            "z-[40] absolute bg-white py-[2px] px-1 -top-[10px] left-3",
            labelClass
          )}
        >
          {label}
        </label>
      )}

      <Listbox
        value={selected}
        onChange={handleChange}
        multiple={isMultiple}
        disabled={disabled || loading}
      >
        <div className="relative">
          <Listbox.Button className="field-control" disabled={disabled || loading}>
            <span
              className={clsx("block text-sm text-left truncate", {
                "opacity-60": !selected || loading,
              })}
            >
              {displayText}
            </span>

            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <AppIcon icon="lucide:chevron-down" />
            </span>
          </Listbox.Button>

          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options anchor="bottom start" className="select-button-options">
              {options.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No options available
                </div>
              ) : (
                options?.map((option, idx) => (
                  <Listbox.Option
                    key={option.value?.id || option.value || idx}
                    value={option}
                    className={({ active }) => clsx("select-option", { active })}
                  >
                    {({ selected }) => (
                      <div className={clsx("option-text", { selected })}>
                        {option.label}
                      </div>
                    )}
                  </Listbox.Option>
                ))
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {!errors && subText && (
        <p className="text-[10px] text-[#98A2B3] mt-[6px]">{subText}</p>
      )}

      {errors?.message && (
        <span className="text-sm text-red-500">{errors.message}</span>
      )}
    </div>
  );
};

export default CustomSelect;