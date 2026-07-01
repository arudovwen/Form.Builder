import clsx from "clsx";
import axios from "axios";
import { getItem } from "@/utils/localStorageControl";
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
  options?: Option[];
  apiUrl?: string;
  value?: string;
  defaultValue?: string;
  onGetValue: (name: string, option: Option | null) => void;
  readOnly?: boolean;
  name: string;
  customClass?: string; 
}

export default function CustomSearchSelect({
  options = [],
  apiUrl,
  value,
  defaultValue,
  onGetValue,
  readOnly,
  name,
  customClass
}: CustomSearchSelectProps) {
  const [query, setQuery] = useState("");
  const [fetchedOptions, setFetchedOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      if (!apiUrl) return;
      
      setLoading(true);
      try {
        const token = getItem("token");
        const axiosconfig = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const response = await axios.get(apiUrl, axiosconfig);
        let data = response.data;
        
        // Normalize nested data structures like { data: [...] } or { data: { data: [...] } }
        if (data && !Array.isArray(data)) {
          if (data.data && Array.isArray(data.data)) {
            data = data.data;
          } else if (data.data?.data && Array.isArray(data.data.data)) {
            data = data.data.data;
          } else if (data.results && Array.isArray(data.results)) {
            data = data.results;
          } else if (data.data?.results && Array.isArray(data.data.results)) {
            data = data.data.results;
          } else if (data.items && Array.isArray(data.items)) {
            data = data.items;
          }
        }

        if (Array.isArray(data)) {
          const mapped = data.map((item) => {
            if (typeof item === "string") return { label: item, value: item };
            return {
              label: item.label || item.name || String(item.id || item.value),
              value: String(item.value || item.id || item.name),
            };
          });
          setFetchedOptions(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch options", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [apiUrl]);

  const activeOptions = apiUrl ? fetchedOptions : options;

  // Find the option object from value/defaultValue string
  const initialOption = useMemo(() => {
    const val = value ?? defaultValue;
    if (val == null || val === "") return null;
    return activeOptions.find((opt) => String(opt.value) === String(val) || String(opt.label) === String(val)) || null;
  }, [value, defaultValue, activeOptions]);

  const [selectedOption, setSelected] = useState<Option | null>(initialOption);

  // Update selected option when value prop changes (controlled component)
  useEffect(() => {
    if (value !== undefined) {
      if (value === null || value === "") {
        setSelected(null);
      } else {
        const option = activeOptions.find((opt) => String(opt.value) === String(value) || String(opt.label) === String(value)) || null;
        setSelected(option);
      }
    }
  }, [value, activeOptions]);

  // Memoized filtered options
  const filteredOptions = useMemo(() => {
    if (query === "") return activeOptions;
    
    const lowerQuery = query.toLowerCase();
    return activeOptions.filter((option) =>
      option.label.toLowerCase().includes(lowerQuery)
    );
  }, [query, activeOptions]);

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
            className={`field-control ${customClass}`}
            displayValue={(option: Option | null) => option?.label || ""}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={loading ? "Loading..." : readOnly ? "" : "Select an option..."}
          />
          {!readOnly && (
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 hover:text-gray-600">
              {loading ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <AppIcon icon="octicon:chevron-down-12" />
              )}
            </ComboboxButton>
          )}
        </div>

        <ComboboxOptions anchor="bottom start" className="select-options__combo">
          {loading ? (
            <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
          ) : filteredOptions.length === 0 ? (
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