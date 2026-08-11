import { Fragment, useEffect, useState, useMemo } from "react";
import { Combobox, Transition } from "@headlessui/react";
import AppIcon from "@/components/ui/AppIcon";
import axios from "axios";
import { getItem } from "@/utils/localStorageControl";

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

  const activeOptions = apiUrl ? fetchedOptions : (element?.options ?? []);

  // Helper to map values to option objects
  const mapValuesToOptions = (vals: any[]) => {
    return vals.map((v) => {
      if (typeof v === "object" && v !== null && "value" in v) return v;
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

  const filteredOptions = useMemo(() => {
    if (query === "") return activeOptions;
    const lowerQuery = query.toLowerCase();
    return activeOptions.filter((option: any) =>
      option.label.toLowerCase().includes(lowerQuery)
    );
  }, [query, activeOptions]);

  const removeValue = (valToRemove: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v.value !== valToRemove.value);
    setSelectedValues(newValues);
    setValue?.(element.id, newValues.map(v => v.value));
  };

  return (
    <div className="relative w-full">
      <Combobox
        value={selectedValues || []}
        onChange={(values: any[]) => {
          setSelectedValues(values);
          setValue?.(element.id, values.map(v => v.value));
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
            as={Fragment}
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
              {loading && fetchedOptions.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
              ) : filteredOptions.length === 0 && query !== "" ? (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No results found.
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <Combobox.Option
                    key={index}
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
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
