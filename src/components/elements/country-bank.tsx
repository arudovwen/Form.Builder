import React, { useEffect, useMemo, useRef } from "react";
import CustomSearchSelect from "../CustomSearchSelect";
import countries from "@/data/countries.json";

interface CountryBankProps {
  element: any;
  validationData: any;
}

export default function CountryBank({
  element,
  validationData,
}: CountryBankProps) {
  const {
    register = () => ({}),
    setValue,
    trigger,
    isReadOnly,
    watch,
  } = validationData || {};

  // Watch the form value
  const rawValue = watch?.(element.id) || "";

  // Parse country and state from rawValue
  const { country, state } = useMemo(() => {
    if (typeof rawValue === "string" && rawValue.includes(",")) {
      const [state, country] = rawValue.split(",").map(s => s.trim());
      return { country, state };
    }
    return { country: rawValue, state: "" };
  }, [rawValue]);

  // Track last synced value to prevent unnecessary updates
  const lastSyncedValue = useRef(rawValue);

  // States for selected country
  const states = useMemo(() => {
    if (!country) return [];

    return (
      countries
        .find((c) => c.name === country)
        ?.states?.map((s) => ({
          label: s.name,
          value: s.name,
        })) || []
    );
  }, [country]);

  // Country select handler
  const handleCountrySelect = (_: string, option: any) => {
    const newCountry = option?.value || "";
    const newValue = newCountry;

    if (setValue && newValue !== lastSyncedValue.current) {
      setValue(element.id, newValue);
      trigger?.(element.id);
      lastSyncedValue.current = newValue;
    }
  };

  // State select handler
  const handleStateSelect = (_: string, option: any) => {
    const newState = option?.value || "";
    const newValue = newState ? `${newState}, ${country}` : country;

    if (setValue && newValue !== lastSyncedValue.current) {
      setValue(element.id, newValue);
      trigger?.(element.id);
      lastSyncedValue.current = newValue;
    }
  };

  // Sync lastSyncedValue ref on mount/rawValue changes
  useEffect(() => {
    lastSyncedValue.current = rawValue;
  }, [rawValue]);

  return (
    <div className="grid gap-y-6">
      {/* Hidden RHF input */}
      <input type="hidden" {...register(element.id)} />

      {/* Country */}
      <CustomSearchSelect
        options={element.options}
        onGetValue={handleCountrySelect}
        name={`${element.id}-country`}
        readOnly={isReadOnly}
        defaultValue={country}
        key={`country-${country}`} // Force re-render when country changes externally
      />

      {/* State */}
      {states.length > 0 && element.showState && (
        <CustomSearchSelect
          options={states}
          onGetValue={handleStateSelect}
          name={`${element.id}-state`}
          readOnly={isReadOnly}
          defaultValue={state}
          key={`state-${state}`} // Force re-render when state changes externally
        />
      )}
    </div>
  );
}