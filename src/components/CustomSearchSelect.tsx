import clsx from "clsx";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
} from "@headlessui/react";
import AppIcon from "./ui/AppIcon";

interface Option {
  label: string;
  value: string;
}

interface CustomSearchSelectProps {
  options: Option[];
  value?: string;
  defaultValue?: string;
  onGetValue: (name: string, option: Option | null) => void;
  readOnly?: boolean;
  name: string;
}

export default function CustomSearchSelect({
  options,
  value,
  defaultValue,
  onGetValue,
  readOnly,
  name,
}: CustomSearchSelectProps) {
  const [query, setQuery] = useState("");

  // Find the option object from value/defaultValue string
  const initialOption = useMemo(() => {
    const val = value ?? defaultValue;
    return options.find((opt) => opt.value === val || opt.label === val) || null;
  }, [value, defaultValue, options]);

  const [selectedOption, setSelected] = useState<Option | null>(initialOption);

  // Update selected option when value prop changes (controlled component)
  useEffect(() => {
    if (value !== undefined) {
      const option = options.find((opt) => opt.value === value || opt.label === value) || null;
      setSelected(option);
    }
  }, [value, options]);

  // Memoized filtered options
  const filteredOptions = useMemo(() => {
    if (query === "") return options;
    
    const lowerQuery = query.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(lowerQuery)
    );
  }, [query, options]);

  // Handle selection change - call parent callback directly
  const handleChange = useCallback((option: Option | null) => {
    setSelected(option);
    onGetValue(name, option);
  }, [name, onGetValue]);

  return (
    <div className="relative w-full">
      <Combobox 
        value={selectedOption} 
        onChange={handleChange}
        disabled={readOnly}
      >
        <div className="relative">
          <ComboboxInput
            className="field-control"
            displayValue={(option: Option | null) => option?.label || ""}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Select an option..."
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 hover:text-gray-600">
            <AppIcon icon="octicon:chevron-down-12" />
          </ComboboxButton>
        </div>

        <ComboboxOptions anchor="bottom start" className="select-options__combo">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No results found.
            </div>
          ) : (
            filteredOptions?.map((option) => (
              <ComboboxOption
                key={option.value}
                value={option}
                className={({ active,selected }) => clsx("select-option", { active,selected })}
              >
                {({ selected }) => (
                  <div className={clsx("option-text", { selected })}>
                    {option.label}
                  </div>
                )}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}