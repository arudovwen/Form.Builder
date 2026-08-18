import clsx from "clsx";
import axios from "axios";
import { getItem } from "@/utils/localStorageControl";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
  selectedLabel?: string;
  onGetValue: (name: string, option: Option | null) => void;
  readOnly?: boolean;
  name: string;
  customClass?: string;
}

const isGuid = (val: any) =>
  typeof val === "string" && /^[0-9a-fA-F-]{20,}$/.test(val);

export default function CustomSearchSelect({
  options = [],
  apiUrl,
  value,
  defaultValue,
  selectedLabel,
  onGetValue,
  readOnly,
  name,
  customClass,
}: CustomSearchSelectProps) {
  const [query, setQuery] = useState<string | null>(null);
  const [fetchedOptions, setFetchedOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const controller = new AbortController();
    const currentVal = value ?? defaultValue;

    // If the user has typed a query, search for it; on initial load, use preloaded value to search
    let searchTerm = "";
    if (query !== null) {
      searchTerm = query;
    } else if (currentVal) {
      searchTerm = String(currentVal);
    }

    const fetchOptions = async () => {
      if (!apiUrl) return;

      setLoading(true);
      try {
        const token = getItem("token");
        const axiosconfig = {
          ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
          signal: controller.signal,
          params: searchTerm ? { search: searchTerm } : {},
        } as any;
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
            const label =
              item.label ??
              item.name ??
              item.title ??
              item.productName ??
              item.description ??
              item.text ??
              item.displayName ??
              String(item.id ?? item.value ?? "");
            const val = String(
              item.value ?? item.id ?? item.key ?? item.code ?? item.name ?? "",
            );
            return {
              label: String(label),
              value: String(val),
            };
          });
          setFetchedOptions(mapped);
        }
      } catch (err: any) {
        if (!axios.isCancel(err)) {
          console.error("Failed to fetch options", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const delay = isInitialMount.current && currentVal ? 0 : 400;
    isInitialMount.current = false;

    const handler = setTimeout(() => {
      fetchOptions();
    }, delay);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [apiUrl, query, value, defaultValue]);

  const activeOptions = apiUrl ? fetchedOptions : options;

  // Find the option object from value/defaultValue string
  const initialOption = useMemo(() => {
    const val = value ?? defaultValue;
    if (val == null || val === "") return null;
    const found = activeOptions.find(
      (opt) =>
        String(opt.value) === String(val) ||
        String(opt.label) === String(val),
    );
    if (found) return found;
    return {
      label: selectedLabel || (isGuid(val) ? "" : String(val)),
      value: String(val),
    };
  }, [value, defaultValue, selectedLabel, activeOptions]);

  const [selectedOption, setSelected] = useState<Option | null>(initialOption);

  // Update selected option when value/defaultValue prop changes (controlled component)
  useEffect(() => {
    const val = value !== undefined ? value : defaultValue;
    if (val !== undefined) {
      if (val === null || val === "") {
        setSelected(null);
      } else {
        const option = activeOptions.find(
          (opt) =>
            String(opt.value) === String(val) ||
            String(opt.label) === String(val),
        );
        if (option) {
          setSelected(option);
        } else {
          setSelected((prev) => {
            if (
              prev &&
              (String(prev.value) === String(val) ||
                String(prev.label) === String(val))
            ) {
              const currentLabel = selectedLabel || (prev.label && !isGuid(prev.label) ? prev.label : isGuid(val) ? "" : String(val));
              return {
                label: currentLabel,
                value: String(val),
              };
            }
            return {
              label: selectedLabel || (isGuid(val) ? "" : String(val)),
              value: String(val),
            };
          });
        }
      }
    }
  }, [value, defaultValue, selectedLabel, activeOptions]);

  // Memoized filtered options
  const filteredOptions = useMemo(() => {
    let list = activeOptions;
    if (
      selectedOption &&
      !list.some(
        (opt) =>
          String(opt.value) === String(selectedOption.value) ||
          String(opt.label) === String(selectedOption.label),
      )
    ) {
      list = [selectedOption, ...list];
    }

    if (!query) return list;

    const lowerQuery = query.toLowerCase();
    return list.filter((option) =>
      option.label.toLowerCase().includes(lowerQuery),
    );
  }, [query, activeOptions, selectedOption]);

  // Handle selection change - call parent callback directly
  const handleChange = useCallback(
    (option: Option | null) => {
      setSelected(option);
      onGetValue(name, option);
    },
    [name, onGetValue],
  );

  return (
    <div className="relative w-full">
      <Combobox
        value={selectedOption}
        onChange={handleChange}
        disabled={readOnly}
        by={(a: any, b: any) =>
          a && b
            ? String(a.value) === String(b.value) ||
              String(a.label) === String(b.label)
            : a === b
        }
      >
        <div className="relative">
          <ComboboxInput
            className={`field-control ${customClass}`}
            displayValue={(option: Option | null) => {
              if (option?.label && !isGuid(option.label)) return option.label;
              if (selectedLabel) return selectedLabel;
              if (option?.label) return option.label;
              const rawVal = value ?? defaultValue;
              if (rawVal && !isGuid(rawVal)) return String(rawVal);
              return "";
            }}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              loading ? "Loading..." : readOnly ? "" : "Select an option..."
            }
          />
          {!readOnly && (
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 hover:text-gray-600">
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <AppIcon icon="octicon:chevron-down-12" />
              )}
            </ComboboxButton>
          )}
        </div>

        <ComboboxOptions
          anchor="bottom start"
          className="select-options__combo"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {loading ? (
            <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No results found.
            </div>
          ) : (
            filteredOptions?.map((option, index) => (
              <ComboboxOption
                key={`${option.value}-${index}`}
                value={option}
                className={({ active, selected }) =>
                  clsx("select-option", { active, selected })
                }
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
