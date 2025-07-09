import React, { useState, useEffect, useMemo } from "react";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import AppIcon from "./ui/AppIcon";

interface CustomSelectProps {
  className?: string;
  options: any[];
  placeholder?: string;
  errors?: any;
  register?: any;
  setValue?: any;
  name: string;
  label?: string;
  value?: any;
  trigger?: any;
  isMultiple?: boolean;
  isFloatingLabel?: boolean;
  subText?: string;
  labelClass?: string;
  loading?: boolean;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  className = "",
  options = [],
  placeholder = "Select",
  errors,
  register,
  setValue,
  name,
  label,
  value,
  trigger,
  isMultiple = false,
  isFloatingLabel = false,
  subText,
  labelClass = "text-[10px]",
  loading,
  disabled,
}) => {
  const [selected, setSelected] = useState<any>(isMultiple ? [] : null);

  const mergedClassNames = clsx("field-control", className);

  // Memoize options to avoid unnecessary recalculations
  const memoizedOptions = useMemo(() => options, [options]);

  // Update selected value when options or value change
  useEffect(() => {
    const selectedOption = options?.find((option) => {
      if (typeof option.value === "string" && typeof value === "string") {
        return option.value.toLowerCase() === value.toLowerCase();
      }
      if (typeof option.value === "object" && typeof value === "object") {
        return option.value.id === value?.id; // Assuming both have 'id' property for comparison
      }
      return option.value === value;
    });

    setSelected(selectedOption || null);
  }, [value, options]);

  useEffect(() => {
    if (selected && setValue && register) {
      setValue(name, selected?.value);
      register(name);
      trigger?.(name);
    }
  }, [name, selected]);

  const handleChange = (value: any) => setSelected(value);

  return (
    <div className="relative">
      {label && !isFloatingLabel && (
        <label className="block text-sm text-[#686878] darks:!text-white/70 mb-2">
          {label}
        </label>
      )}

      {isFloatingLabel && label && (
        <label
          className={`z-[40] absolute block text-[#667085] bg-white py-[2px] px-1 -top-[10px] left-3 ${labelClass}`}
        >
          {label}
        </label>
      )}

      <Listbox value={selected} onChange={handleChange} multiple={isMultiple} disabled={disabled}>
        <div className="relative">
          <Listbox.Button className={mergedClassNames} disabled={disabled}>
            {loading ? (
              <span className="block text-sm text-left opacity-60">Fetching data...</span>
            ) : (
              <span className="block text-sm text-left truncate">
                {selected?.label || <span className="opacity-60">{placeholder}</span>}
              </span>
            )}
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <AppIcon icon="lucide:chevron-down" />
            </span>
          </Listbox.Button>

          <Transition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-[77] absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white darks:bg-gray-800 text-gray-900 darks:text-white/80 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {memoizedOptions?.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    clsx(
                      "relative cursor-default select-none py-2 pl-4 pr-4 text-sm",
                      active ? "bg-gray-100 darks:bg-gray-700 text-gray-900 darks:text-white/80" : "text-gray-900 darks:text-white/70"
                    )
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <div className={`block truncate text-sm ${selected ? "font-medium" : "font-normal"}`}>
                      {option.label}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {subText && !errors && (
        <p className="text-[10px] text-[#98A2B3] leading-normal mt-[6px]">{subText}</p>
      )}

      {errors && <span className="text-sm text-red-500">{errors.message}</span>}
    </div>
  );
};

export default CustomSelect;
