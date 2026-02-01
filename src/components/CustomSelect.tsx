import React, { useState, useEffect, useMemo } from "react";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import AppIcon from "./ui/AppIcon";

interface CustomSelectProps {
  className?: string;
  options: any;
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
 
  /** ----------------------------------------------
   *  Compute selected option from external value
   *  Only recompute when value or options change
   * ---------------------------------------------- */
  const computedSelected = useMemo(() => {
    if (!options) return null;

    return (
      options.find((o: any) => {
        if (typeof o.value === "string" && typeof value === "string")
          return o.value.toLowerCase() === value.toLowerCase();

        if (typeof o.value === "object" && typeof value === "object")
          return o.value.id === value?.id;

        return o.value === value;
      }) || null
    );
  }, [value, options]);

  /** Sync external value → internal state */
  useEffect(() => {
    // Avoid unnecessary updates
    if (computedSelected?.value !== selected?.value) {
      setSelected(computedSelected);
    }
  }, [computedSelected, selected?.value]);

  /** Update form state (setValue, trigger, register) */
  useEffect(() => {
    if (!selected || !setValue) return;

    setValue(name, selected?.value);

    register?.(name);
    trigger?.(name);
  }, [name, register, selected, setValue, trigger]);

  return (
    <div className="relative">
      {!isFloatingLabel && label && (
        <label className="block text-sm text-[#686878] darks:text-white/70 mb-2">
          {label}
        </label>
      )}

      {isFloatingLabel && (
        <label
          className={`z-[40] absolute bg-white py-[2px] px-1 -top-[10px] left-3 ${labelClass}`}
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
          <Listbox.Button  className={"field-control"} disabled={disabled}>
            {loading ? (
              <span className="text-sm opacity-60">Fetching data...</span>
            ) : (
              <span className="block text-sm text-left truncate">
                {selected?.label || (
                  <span className="opacity-60">{placeholder}</span>
                )}
              </span>
            )}

            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <AppIcon icon="lucide:chevron-down" />
            </span>
          </Listbox.Button>

          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options anchor="bottom start" className="select-options">
              {options?.map((option: any, idx: number) => (
                <Listbox.Option
                  key={idx}
                  value={option}
                  className={({ active }) =>
                    clsx("select-option", { active })
                  }
                >
                  {({ selected }) => (
                    <div
                      className={clsx("option-text", {
                        selected,
                      })}
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
        <p className="text-[10px] text-[#98A2B3] mt-[6px]">{subText}</p>
      )}

      {errors && <span className="text-sm text-red-500">{errors.message}</span>}
    </div>
  );
};

export default CustomSelect;
