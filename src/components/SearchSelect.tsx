import React, { useState, useEffect, useMemo } from "react";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import AppIcon from "./ui/AppIcon";
// import "./CustomSelect.css";

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
  labelClass = "",
  loading,
  disabled,
}) => {
  const [selected, setSelected] = useState<any>(isMultiple ? [] : null);

  const mergedClassNames = clsx("custom-select__control", className);

  const memoizedOptions = useMemo(() => options, [options]);

  useEffect(() => {
    const selectedOption = options?.find((option) => {
      if (typeof option.value === "string" && typeof value === "string") {
        return option.value.toLowerCase() === value.toLowerCase();
      }
      if (typeof option.value === "object" && typeof value === "object") {
        return option.value?.id === value?.id;
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

  return (
    <div className="custom-select">
      {label && !isFloatingLabel && (
        <label className="custom-select__label">{label}</label>
      )}

      {isFloatingLabel && label && (
        <label className={clsx("custom-select__floating-label", labelClass)}>
          {label}
        </label>
      )}

      <Listbox
        value={selected}
        onChange={setSelected}
        multiple={isMultiple}
        disabled={disabled}
      >
        <div className="custom-select__wrapper">
          <Listbox.Button className={mergedClassNames} disabled={disabled}>
            {loading ? (
              <span className="custom-select__loading">
                Fetching data...
              </span>
            ) : (
              <span className="custom-select__value">
                {selected?.label || (
                  <span className="custom-select__placeholder">
                    {placeholder}
                  </span>
                )}
              </span>
            )}
            <span className="custom-select__icon">
              <AppIcon icon="lucide:chevron-down" />
            </span>
          </Listbox.Button>

          <Transition
            as={React.Fragment}
            leave="custom-select__transition"
          >
            <Listbox.Options className="custom-select__options"  anchor="bottom">
              {memoizedOptions.map((option, idx) => (
                <Listbox.Option
                  key={idx}
                  value={option}
                  className={({ active }) =>
                    clsx(
                      "custom-select__option",
                      active && "custom-select__option--active"
                    )
                  }
                >
                  {({ selected }) => (
                    <span
                      className={clsx(
                        "custom-select__option-label",
                        selected && "custom-select__option--selected"
                      )}
                    >
                      {option.label}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {subText && !errors && (
        <p className="custom-select__subtext">{subText}</p>
      )}

      {errors && (
        <span className="custom-select__error">
          {errors.message}
        </span>
      )}
    </div>
  );
};

export default CustomSelect;
