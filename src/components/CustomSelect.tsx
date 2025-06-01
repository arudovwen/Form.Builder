import React, { useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import AppIcon from "./ui/AppIcon";

// interface Option {
//   label: string;
//   value: string | number | null;
// }

interface CustomSelectProps {
  className?: string;
  options: any[];
  placeholder?: string;
  errors?: any;
  register?: any; // Adjust type based on your useForm usage
  setValue?: any; // Adjust type based on your useForm usage
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
  options,
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
  const [selected, setSelected] = useState<any>(isMultiple ? [] : null);
  const merged = clsx("input-control", className);

  useEffect(() => {
    if (selected && setValue && register) {
      setValue(name, selected?.value);
      if (register) {
        register(name);
      }
      if (trigger) {
        trigger(name);
      }
    }
  }, [name, register, selected, setValue, trigger]);

  useEffect(() => {
    const tempData = options?.find((option: any) => {
      // If option.value and value are both strings, compare them case-insensitively
      if (typeof option.value === "string" && typeof value === "string") {
        return option.value.toLowerCase() === value.toLowerCase();
      }

      // If option.value and value are both objects, compare based on some unique property (e.g., 'id')
      if (typeof option.value === "object" && typeof value === "object") {
        return option.value.id === value?.id; // Assuming both have 'id' property for comparison
      }

      // Default case: compare primitive values directly
      return option.value === value;
    });

    // Set selected option or null if not found
    setSelected(tempData || null);
  }, [value, options]);

  return (
    <div className="relative">
      {!isFloatingLabel && label && (
        <label className="block text-sm text-[#686878] darks:!text-white/70  mb-2">
          {label}
        </label>
      )}
      {isFloatingLabel && (
        <label
          className={`z-[40] absolute block text-[#667085] bg-white  py-[2px] px-1 -top-[10px] left-3  ${labelClass}`}
        >
          {label}
        </label>
      )}
      <Listbox
        value={selected}
        onChange={setSelected}
        multiple={isMultiple}
        disabled={disabled}
      >
        <div className="relative">
          <Listbox.Button className={merged} disabled={disabled}>
            {loading ? (
              <span className=" block opacity-60 text-sm text-left">
                Fetching data ...
              </span>
            ) : (
              <span className="block truncate text-sm text-left">
                {selected?.label || (
                  <span className="opacity-60">{placeholder}</span>
                )}
              </span>
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
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
              {options?.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-4 pr-4  text-sm ${
                      active
                        ? "bg-gray-100 darks:bg-gray-700 text-gray-900 darks:text-white/80"
                        : "text-gray-900 darks:text-white/70 "
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <div
                      className={`block truncate text-sm ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.label}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {!errors && subText && (
        <p className="text-[10px] text-[#98A2B3] leading-normal mt-[6px]">
          {subText}
        </p>
      )}
      {errors && <span className="text-sm text-red-500">{errors.message}</span>}
    </div>
  );
};

export default CustomSelect;
