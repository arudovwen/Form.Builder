import clsx from "clsx";
import React, { useState, useEffect } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
} from "@headlessui/react";
import AppIcon from "./ui/AppIcon";

export default function CustomSearchSelect({
  options,
  defaultValue,
  onGetValue,
  readOnly,
  name,
}: {
  options: any[];
  defaultValue?: any;
  onGetValue: (value: any, name: string) => void;
  readOnly?: boolean;
  name: string;
}) {
  const [query, setQuery] = useState("");
  const [selectedOption, setSelected] = useState(
    defaultValue || options[0] || null
  );

  const filteredPeople =
    query === ""
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase())
        );

  useEffect(() => {
    if (onGetValue) {
      onGetValue(name, selectedOption);
    }
  }, [selectedOption, name]);

  return (
    <div className="relative w-full">
      <Combobox value={selectedOption} onChange={setSelected}>
        <div className="relative">
          <ComboboxInput
            disabled={readOnly}
            className={"field-control"}
            displayValue={(option: any) => option?.label}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Select a option..."
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 hover:text-gray-600">
            <AppIcon icon="octicon:chevron-down-12" />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          className={clsx(
            "absolute z-10 mt-2 max-h-60 w-full overflow-auto no-scrollbar rounded-md border border-gray-200 bg-white p-1 shadow-lg",
            "ring-1 ring-black ring-opacity-5 focus:outline-none"
          )}
        >
          {filteredPeople.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No results found.
            </div>
          ) : (
            filteredPeople.map((option, index) => (
              <ComboboxOption
                key={index}
                value={option}
                className={({ active, selected }) =>
                  clsx(
                    "cursor-default select-none rounded-md px-3 py-2 text-sm",
                    active ? "bg-gray-100 text-gray-900" : "text-gray-900",
                    selected && "font-semibold"
                  )
                }
              >
                {option.label}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
