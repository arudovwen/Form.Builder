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
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    const val = value !== undefined && value !== null && value !== "" ? value : defaultValue;
    if (val === undefined || val === null || val === "") return null;
    const rawVal: any = val;
    if (typeof rawVal === "object" && "value" in rawVal) {
      return {
        label: rawVal.label || selectedLabel || String(rawVal.value),
        value: String(rawVal.value),
      };
    }
    const found = activeOptions.find(
      (opt) =>
        String(opt.value) === String(rawVal) ||
        String(opt.label) === String(rawVal),
    );
    if (found) return found;
    return {
      label: selectedLabel || String(rawVal),
      value: String(rawVal),
    };
  }, [value, defaultValue, selectedLabel, activeOptions]);

  const [selectedOption, setSelected] = useState<Option | null>(initialOption);

  // Update selected option when value/defaultValue prop changes (controlled component)
  useEffect(() => {
    const val = value !== undefined ? value : defaultValue;
    if (val === undefined || val === null || val === "") {
      setSelected(null);
    } else {
      const rawVal: any = val;
      if (typeof rawVal === "object" && "value" in rawVal) {
        setSelected({
          label: rawVal.label || selectedLabel || String(rawVal.value),
          value: String(rawVal.value),
        });
        return;
      }
      const option = activeOptions.find(
        (opt) =>
          String(opt.value) === String(rawVal) ||
          String(opt.label) === String(rawVal),
      );
      if (option) {
        setSelected(option);
      } else {
        setSelected((prev) => {
          const currentLabel =
            selectedLabel ||
            (prev &&
            (String(prev.value) === String(rawVal) ||
              String(prev.label) === String(rawVal)) &&
            prev.label
              ? prev.label
              : String(rawVal));
          return {
            label: currentLabel,
            value: String(rawVal),
          };
        });
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

  const isExactMatch = useMemo(() => {
    if (!query || query.trim() === "") return true;
    const q = query.trim().toLowerCase();
    return activeOptions.some(
      (opt) =>
        opt.label.toLowerCase() === q || String(opt.value).toLowerCase() === q,
    );
  }, [query, activeOptions]);

  // Handle selection change - call parent callback directly
  const handleChange = useCallback(
    (option: Option | null) => {
      setSelected(option);
      setQuery(null);
      onGetValue(name, option);
    },
    [name, onGetValue],
  );

  const resolveCustomQuery = useCallback(() => {
    if (query !== null) {
      const trimmed = query.trim();
      if (trimmed === "") {
        if (selectedOption !== null) {
          handleChange(null);
        }
      } else {
        const match = activeOptions.find(
          (opt) =>
            opt.label.toLowerCase() === trimmed.toLowerCase() ||
            String(opt.value).toLowerCase() === trimmed.toLowerCase(),
        );
        if (match) {
          handleChange(match);
        } else {
          handleChange({ label: trimmed, value: trimmed });
        }
      }
    }
  }, [query, activeOptions, selectedOption, handleChange]);

  const handleClose = useCallback(() => {
    resolveCustomQuery();
    setQuery(null);
  }, [resolveCustomQuery]);

  return (
    <div className="relative w-full">
      <Combobox
        value={selectedOption}
        onChange={handleChange}
        onClose={handleClose}
        disabled={readOnly}
        by={(a: any, b: any) =>
          a && b
            ? String(a.value) === String(b.value) ||
              String(a.label) === String(b.label)
            : a === b
        }
      >
        {({ open }) => (
          <>
            <div className="relative">
              <ComboboxInput
                className={`field-control ${customClass}`}
                displayValue={(option: any) => {
                  if (option && typeof option === "object") {
                    if (option.label && String(option.label).trim() !== "") return option.label;
                    if (option.value !== undefined && option.value !== null && String(option.value).trim() !== "") return String(option.value);
                  }
                  if (typeof option === "string" && option.trim() !== "") return option;
                  if (selectedLabel && selectedLabel.trim() !== "") return selectedLabel;
                  const rawVal = value ?? defaultValue;
                  if (rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== "") return String(rawVal);
                  return "";
                }}
                onChange={(event) => setQuery(event.target.value)}
                onBlur={() => {
                  resolveCustomQuery();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query !== null && query.trim() !== "") {
                    const trimmed = query.trim();
                    const match = filteredOptions.find(
                      (opt) =>
                        opt.label.toLowerCase() === trimmed.toLowerCase() ||
                        String(opt.value).toLowerCase() === trimmed.toLowerCase(),
                    );
                    if (!match) {
                      e.preventDefault();
                      handleChange({ label: trimmed, value: trimmed });
                    }
                  }
                }}
                onClick={() => {
                  if (!open && !readOnly) {
                    buttonRef.current?.click();
                  }
                }}
                onFocus={() => {
                  if (!open && !readOnly) {
                    buttonRef.current?.click();
                  }
                }}
                placeholder={
                  loading ? "Loading..." : readOnly ? "" : "Select an option..."
                }
              />
              {!readOnly && (
                <ComboboxButton
                  ref={buttonRef}
                  className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 hover:text-gray-600"
                >
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
              ) : (
                <>
                  {filteredOptions?.map((option, index) => (
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
                  ))}

                  {query && query.trim() !== "" && !isExactMatch && (
                    <ComboboxOption
                      value={{ label: query.trim(), value: query.trim() }}
                      className={({ active }) =>
                        clsx("select-option !bg-indigo-50/70 hover:!bg-indigo-100/80 !text-indigo-900 border-t border-indigo-100", {
                          active: active,
                        })
                      }
                    >
                      <div className="flex items-center gap-1.5 py-0.5">
                        <span className="text-xs text-indigo-500 font-normal">Use:</span>
                        <span className="font-semibold text-indigo-700 truncate">
                          "{query.trim()}"
                        </span>
                      </div>
                    </ComboboxOption>
                  )}

                  {filteredOptions.length === 0 && (!query || query.trim() === "") && (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No results found.
                    </div>
                  )}
                </>
              )}
            </ComboboxOptions>
          </>
        )}
      </Combobox>
    </div>
  );
}
