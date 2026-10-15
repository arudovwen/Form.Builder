import { useEffect, useState, useMemo, useRef } from "react";
import { Combobox, Transition } from "@headlessui/react";
import AppIcon from "@/components/ui/AppIcon";
import axios from "axios";
import { getItem } from "@/utils/localStorageControl";
import {
  getFilteredOptions,
  getParentFieldValue,
  pruneSelectedValues,
} from "@/utils/optionFiltering";

export default function MultiSelectInput({
  element,
  validationData,
  placeholder,
}: {
  element: any;
  validationData: any;
  placeholder?: string;
}) {
  const {
    register = () => ({}),
    setValue,
    trigger,
    isReadOnly,
    watch,
    getValues,
    isViewer,
  } = validationData || {};

  const [query, setQuery] = useState("");
  const [fetchedOptions, setFetchedOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = isViewer ? element.apiUrl : undefined;

  useEffect(() => {
    if (!apiUrl) return;

    const controller = new AbortController();
    const handler = setTimeout(() => {
      const fetchOptions = async () => {
        setLoading(true);
        try {
          const token = getItem("token");
          const axiosconfig = {
            ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
            signal: controller.signal,
            params: query ? { search: query } : {},
          } as any;
          const response = await axios.get(apiUrl, axiosconfig);
          let data = response.data;

          if (data && !Array.isArray(data)) {
            if (data.data && Array.isArray(data.data)) data = data.data;
            else if (data.data?.data && Array.isArray(data.data.data)) data = data.data.data;
            else if (data.results && Array.isArray(data.results)) data = data.results;
            else if (data.data?.results && Array.isArray(data.data.results)) data = data.data.results;
            else if (data.items && Array.isArray(data.items)) data = data.items;
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
        } catch (err: any) {
          if (!axios.isCancel(err)) console.error("Failed to fetch options", err);
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      };

      fetchOptions();
    }, 500);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [apiUrl, query]);

  const parentFieldValue = getParentFieldValue(
    element?.filterByFieldId,
    validationData,
  );

  const rawOptions = apiUrl ? fetchedOptions : (element?.options ?? []);

  const activeOptions = useMemo(() => {
    return getFilteredOptions(
      rawOptions,
      element?.filterByFieldId,
      parentFieldValue,
    );
  }, [rawOptions, element?.filterByFieldId, parentFieldValue]);

  // Helper to map values to option objects
  const mapValuesToOptions = (vals: any[]) => {
    return vals.map((v) => {
      if (typeof v === "object" && v !== null && "value" in v) {
        const found = activeOptions.find((opt: any) => String(opt.value) === String(v.value));
        return found ? { ...found, ...v } : v;
      }
      const found = activeOptions.find((opt: any) => String(opt.value) === String(v));
      return found || { label: String(v), value: v };
    });
  };

  // Initialize from the current RHF value so values survive section navigation
  const [selectedValues, setSelectedValues] = useState<
    { label: string; value: any }[]
  >(() => {
    const current = getValues?.(element.id);
    return Array.isArray(current) ? mapValuesToOptions(current) : [];
  });

  /* ---------------- Register field ---------------- */
  useEffect(() => {
    register(element.id);
  }, [element.id, register]);

  // Keep local state in sync when RHF value changes from outside (e.g. answerData hydration)
  useEffect(() => {
    if (!watch) return;
    const subscription = watch((values: { [x: string]: any }) => {
      const val = values[element.id];
      if (val !== undefined) {
        setSelectedValues(Array.isArray(val) ? mapValuesToOptions(val) : []);
      }
    });
    return () => subscription.unsubscribe?.();
  }, [watch, element.id, activeOptions]);

  // Prune invalid selected values when parent value changes
  const isHydratedRef = useRef(false);
  const prevParentValRef = useRef<any>(undefined);
  useEffect(() => {
    if (!element?.filterByFieldId) return;

    if (!isHydratedRef.current) {
      if (parentFieldValue !== undefined) {
        isHydratedRef.current = true;
        prevParentValRef.current = parentFieldValue;
      }
      return;
    }

    if (
      prevParentValRef.current !== undefined &&
      prevParentValRef.current !== parentFieldValue
    ) {
      prevParentValRef.current = parentFieldValue;

      if (element.clearOnFilterChange !== false && selectedValues.length > 0) {
        const pruned = pruneSelectedValues(selectedValues, activeOptions);
        if (pruned.length !== selectedValues.length) {
          setSelectedValues(pruned);
          const result = element?.returnObjects ? pruned : pruned.map((v) => v.value);
          setValue?.(element.id, result, {
            shouldValidate: true,
            shouldDirty: true,
          });
          if (trigger) trigger(element.id);
        }
      }
    }
  }, [
    element?.filterByFieldId,
    element?.clearOnFilterChange,
    element?.returnObjects,
    element.id,
    activeOptions,
    parentFieldValue,
    selectedValues,
    setValue,
    trigger,
  ]);

  const filteredOptions = useMemo(() => {
    if (query === "") return activeOptions;
    const lowerQuery = query.toLowerCase();
    return activeOptions.filter((option: any) =>
      option.label.toLowerCase().includes(lowerQuery)
    );
  }, [query, activeOptions]);

  const isExactMatch = useMemo(() => {
    if (!query || query.trim() === "") return true;
    const trimmed = query.trim().toLowerCase();
    return (
      activeOptions.some(
        (opt: any) =>
          opt.label?.toLowerCase() === trimmed ||
          String(opt.value)?.toLowerCase() === trimmed,
      ) ||
      selectedValues.some(
        (sv) =>
          sv.label?.toLowerCase() === trimmed ||
          String(sv.value)?.toLowerCase() === trimmed,
      )
    );
  }, [query, activeOptions, selectedValues]);

  const addCustomValue = (customText: string) => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    const alreadySelected = selectedValues.some(
      (sv) =>
        sv.label?.toLowerCase() === trimmed.toLowerCase() ||
        String(sv.value)?.toLowerCase() === trimmed.toLowerCase(),
    );
    if (alreadySelected) {
      setQuery("");
      return;
    }
    const newOption = { label: trimmed, value: trimmed };
    const newValues = [...selectedValues, newOption];
    setSelectedValues(newValues);
    const result = element?.returnObjects ? newValues : newValues.map((v) => v.value);
    setValue?.(element.id, result, { shouldDirty: true, shouldValidate: true });
    trigger?.(element.id);
    setQuery("");
  };

  const removeValue = (valToRemove: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v.value !== valToRemove.value);
    setSelectedValues(newValues);
    const result = element?.returnObjects ? newValues : newValues.map((v) => v.value);
    setValue?.(element.id, result, { shouldDirty: true, shouldValidate: true });
    trigger?.(element.id);
  };

  return (
    <div className="relative w-full">
      <Combobox
        value={selectedValues || []}
        onChange={(values: any[]) => {
          setSelectedValues(values);
          const result = element?.returnObjects ? values : values.map((v) => v.value);
          setValue?.(element.id, result, { shouldDirty: true, shouldValidate: true });
          trigger?.(element.id);
        }}
        multiple
        disabled={isReadOnly}
        by="value"
      >
        <div className="relative">
          <Combobox.Button as="div" className="w-full">
            <div
              className={`multiselect-control${isReadOnly ? " disabled" : ""}`}
            >
              {selectedValues.map((sv, idx) => (
                <span key={idx} className="custom-select__chip">
                  {sv.label}
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={(e) => removeValue(sv, e)}
                      className="custom-select__chip-remove"
                    >
                      <AppIcon icon="mdi:close" iconClass="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              {!isReadOnly && (
                <Combobox.Input
                  className="multiselect-search"
                  onChange={(event) => setQuery(event.target.value)}
                  onFocus={() => setQuery("")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && query && query.trim() !== "") {
                      const trimmed = query.trim();
                      const match = filteredOptions.find(
                        (opt: any) =>
                          opt.label?.toLowerCase() === trimmed.toLowerCase() ||
                          String(opt.value)?.toLowerCase() === trimmed.toLowerCase(),
                      );
                      if (!match) {
                        e.preventDefault();
                        addCustomValue(trimmed);
                      }
                    }
                  }}
                  displayValue={() => ""}
                  placeholder={
                    selectedValues.length === 0 ? placeholder ?? "Select options..." : "Search..."
                  }
                />
              )}
              {isReadOnly && selectedValues.length === 0 && (
                <span className="multiselect-placeholder">
                  {placeholder ?? "Select options..."}
                </span>
              )}
            </div>
          </Combobox.Button>

          {!isReadOnly && (
            <Combobox.Button className="select-icon">
              {loading ? (
                <div className="w-4 h-4 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              ) : (
                <AppIcon icon="lucide:chevron-down" iconClass="text-gray-400" />
              )}
            </Combobox.Button>
          )}

          <Transition
            leave="fade-leave"
            leaveFrom="fade-to"
            leaveTo="fade-from"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options 
              anchor="bottom start" 
              className="select-button-options"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {loading && fetchedOptions.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
              )}

              {!loading &&
                filteredOptions.map((option, index) => (
                  <Combobox.Option
                    key={`${option.value}-${index}`}
                    value={option}
                    className={({ active }) =>
                      `select-option ${active ? "active" : ""}`
                    }
                  >
                    {({ selected }) => (
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`option-text ${selected ? "selected" : ""}`}
                        >
                          {option.label}
                        </span>
                        {selected ? (
                          <span className="text-blue-600">
                            <AppIcon icon="mdi:check" iconClass="w-5 h-5" />
                          </span>
                        ) : null}
                      </div>
                    )}
                  </Combobox.Option>
                ))}

              {query && query.trim() !== "" && !isExactMatch && !loading && (
                <Combobox.Option
                  value={{ label: query.trim(), value: query.trim() }}
                  className={({ active }) =>
                    `select-option !bg-indigo-50/70 hover:!bg-indigo-100/80 !text-indigo-900 border-t border-indigo-100 cursor-pointer ${
                      active ? "active" : ""
                    }`
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
                </Combobox.Option>
              )}

              {filteredOptions.length === 0 &&
                !loading &&
                (!query || query.trim() === "" || isExactMatch) && (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No results found.
                  </div>
                )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
