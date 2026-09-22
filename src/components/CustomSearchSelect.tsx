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
  allowCustom?: boolean;
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
  allowCustom = true,
}: CustomSearchSelectProps) {
  const [query, setQuery] = useState<string | null>(null);
  const [fetchedOptions, setFetchedOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsCacheRef = useRef<Map<string, Option>>(new Map());

  // Store options in cache for fast lookup and persistence
  const cacheOptions = useCallback((opts: Option[]) => {
    opts.forEach((opt) => {
      if (opt && opt.value !== undefined && opt.value !== null) {
        optionsCacheRef.current.set(String(opt.value), opt);
      }
      if (opt && opt.label) {
        optionsCacheRef.current.set(opt.label.toLowerCase(), opt);
      }
    });
  }, []);

  // Cache static options on change
  useEffect(() => {
    if (options && options.length > 0) {
      cacheOptions(options);
    }
  }, [options, cacheOptions]);

  // Fetch options when apiUrl or query changes
  useEffect(() => {
    if (!apiUrl) return;

    const controller = new AbortController();
    const isSearchQuery = query !== null && query.trim() !== "";
    const searchTerm = isSearchQuery ? query.trim() : "";

    const fetchOptions = async () => {
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
          const mapped: Option[] = data.map((item) => {
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
          cacheOptions(mapped);
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

    const delay = isSearchQuery ? 350 : 0;
    const handler = setTimeout(() => {
      fetchOptions();
    }, delay);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [apiUrl, query, cacheOptions]);

  const activeOptions = useMemo(() => {
    return apiUrl ? fetchedOptions : options;
  }, [apiUrl, fetchedOptions, options]);

  // Resolve option object from value/defaultValue
  const resolveOption = useCallback(
    (rawVal: any): Option | null => {
      if (rawVal === undefined || rawVal === null || rawVal === "") return null;
      if (typeof rawVal === "object" && "value" in rawVal) {
        const opt = {
          label: rawVal.label || selectedLabel || String(rawVal.value),
          value: String(rawVal.value),
        };
        optionsCacheRef.current.set(String(opt.value), opt);
        return opt;
      }

      const strVal = String(rawVal);
      // Check activeOptions first
      const foundInActive = activeOptions.find(
        (opt) =>
          String(opt.value) === strVal ||
          opt.label.toLowerCase() === strVal.toLowerCase(),
      );
      if (foundInActive) return foundInActive;

      // Check cache
      const cached =
        optionsCacheRef.current.get(strVal) ||
        optionsCacheRef.current.get(strVal.toLowerCase());
      if (cached) return cached;

      // Fallback
      return {
        label: selectedLabel || strVal,
        value: strVal,
      };
    },
    [activeOptions, selectedLabel],
  );

  const [selectedOption, setSelected] = useState<Option | null>(() => {
    const initialVal =
      value !== undefined && value !== null && value !== ""
        ? value
        : defaultValue;
    return resolveOption(initialVal);
  });

  // Sync selected option when external value/defaultValue changes
  useEffect(() => {
    const currentVal = value !== undefined ? value : defaultValue;
    if (currentVal === undefined || currentVal === null || currentVal === "") {
      setSelected(null);
    } else {
      const resolved = resolveOption(currentVal);
      setSelected(resolved);
    }
  }, [value, defaultValue, resolveOption]);

  // Compute filtered options for display
  const filteredOptions = useMemo(() => {
    let list = activeOptions;

    // Ensure selectedOption is in the list when not searching
    if (
      selectedOption &&
      !query &&
      !list.some(
        (opt) =>
          String(opt.value) === String(selectedOption.value) ||
          String(opt.label) === String(selectedOption.label),
      )
    ) {
      list = [selectedOption, ...list];
    }

    if (!query || query.trim() === "") return list;

    // If using API, fetchedOptions is already filtered by the API search endpoint
    if (apiUrl) {
      return list;
    }

    const lowerQuery = query.toLowerCase().trim();
    return list.filter((option) =>
      option.label.toLowerCase().includes(lowerQuery),
    );
  }, [query, activeOptions, selectedOption, apiUrl]);

  const isExactMatch = useMemo(() => {
    if (!query || query.trim() === "") return true;
    const trimmed = query.trim().toLowerCase();
    return filteredOptions.some(
      (opt) =>
        opt.label.toLowerCase() === trimmed ||
        String(opt.value).toLowerCase() === trimmed,
    );
  }, [query, filteredOptions]);

  // Handle selection change
  const handleChange = useCallback(
    (option: Option | null) => {
      setSelected(option);
      setQuery(null);
      if (option) {
        optionsCacheRef.current.set(String(option.value), option);
      }
      onGetValue(name, option);
    },
    [name, onGetValue],
  );

  return (
    <div className="relative w-full">
      <Combobox
        value={selectedOption}
        onChange={handleChange}
        onClose={() => setQuery(null)}
        disabled={readOnly}
        by={(a: any, b: any) =>
          a && b
            ? (a.value !== undefined && b.value !== undefined
                ? String(a.value) === String(b.value)
                : String(a.label) === String(b.label))
            : a === b
        }
      >
        <div className="relative">
          <ComboboxInput
            className={`field-control ${customClass ?? ""}`}
            displayValue={(opt: any) => {
              if (opt && typeof opt === "object") {
                if (opt.label && String(opt.label).trim() !== "")
                  return opt.label;
                if (
                  opt.value !== undefined &&
                  opt.value !== null &&
                  String(opt.value).trim() !== ""
                )
                  return String(opt.value);
              }
              if (typeof opt === "string" && opt.trim() !== "") return opt;
              if (selectedOption?.label) return selectedOption.label;
              if (selectedLabel && selectedLabel.trim() !== "")
                return selectedLabel;
              const rawVal = value ?? defaultValue;
              if (
                rawVal !== undefined &&
                rawVal !== null &&
                String(rawVal).trim() !== ""
              )
                return String(rawVal);
              return "";
            }}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(e) => {
              if (
                allowCustom &&
                e.key === "Enter" &&
                query !== null &&
                query.trim() !== ""
              ) {
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
              if (!readOnly) {
                buttonRef.current?.click();
              }
            }}
            onFocus={() => {
              if (!readOnly) {
                buttonRef.current?.click();
              }
            }}
            placeholder={
              loading
                ? "Loading..."
                : readOnly
                  ? ""
                  : "Select an option..."
            }
          />
          {!readOnly && (
            <ComboboxButton
              ref={buttonRef}
              className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 hover:text-gray-600"
            >
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4 text-blue-500"
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
          transition
          anchor="bottom start"
          className="select-options__combo transition duration-100 ease-in data-[closed]:opacity-0"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {loading && filteredOptions.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">
              Loading options...
            </div>
          )}

          {!loading &&
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
            ))}

          {allowCustom &&
            query &&
            query.trim() !== "" &&
            !isExactMatch &&
            !loading && (
              <ComboboxOption
                value={{ label: query.trim(), value: query.trim() }}
                className={({ active }) =>
                  clsx(
                    "select-option !bg-indigo-50/70 hover:!bg-indigo-100/80 !text-indigo-900 border-t border-indigo-100 cursor-pointer",
                    { active },
                  )
                }
              >
                <div className="flex items-center gap-1.5 py-0.5">
                  <span className="text-xs text-indigo-500 font-normal">
                    Add / Use:
                  </span>
                  <span className="font-semibold text-indigo-700 truncate">
                    "{query.trim()}"
                  </span>
                </div>
              </ComboboxOption>
            )}

          {filteredOptions.length === 0 &&
            !loading &&
            (!allowCustom || !query || query.trim() === "") && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No results found.
              </div>
            )}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
