import React, { useState, useEffect, useMemo } from "react";
import { Combobox } from "@headlessui/react";
import AppIcon from "./ui/AppIcon";
import countries from "../data/countrycodes";

interface PhoneInputProps {
  label?: string;
  placeholder?: string;
  classLabel?: string;
  isRequired?: boolean;
  isOptional?: boolean;
  name?: string;
  value?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  horizontal?: boolean;
  description?: string;
  validate?: string;
  onChange?: (val: string) => void;
  onError?: (err: string | null) => void;
}

export default function PhoneInput({
  label,
  placeholder,
  classLabel,
  isRequired,
  isOptional,
  name,
  value,
  error,
  disabled,
  readOnly,
  horizontal,
  description,
  validate,
  onChange,
  onError,
}: PhoneInputProps) {
  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [number, setNumber] = useState("");

  // Build country list
  const countryList = useMemo(
    () =>
      countries
        ?.slice() // create a shallow copy so we don’t mutate state
        .sort((a, b) => a.label.localeCompare(b.label))
        ?.map((c) => ({ ...c, phone: `+${c.phone}` })),
    []
  );

  // Filtered country options
  const filteredCountries = useMemo(() => {
    if (!query) return countryList;
    return countryList.filter((c) =>
      `${c.label} ${c.phone}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, countryList]);

  const min = selectedCountry?.min || 10;
  const max = selectedCountry?.max || 10;

  // Format & parse values
  const formatPhone = () =>
    number ? `${selectedCountry?.phone || "+234"}-${number}` : "";

  const parsePhone = (val: string) => {
    if (!val) return { code: "+234", number: "" };
    const parts = val.split(/[-\s]/);
    return { code: parts[0], number: parts.slice(1).join(" ") };
  };

  // Handle incoming value
  useEffect(() => {
    if (value) {
      const parsed = parsePhone(value);
      setSelectedCountry(
        countryList.find((c) => c.phone === parsed.code) || countryList[0]
      );
      setNumber(parsed.number);
    }
  }, [value, countryList]);

  // Compute error message
  const phoneError = useMemo(() => {
    if (error) return error;
    const len = number.length;

    if (isRequired && len === 0) return "Phone number is required";
    if (len > 0 && !/^\d+$/.test(number))
      return "Phone number must contain only digits";
    if (len > 0 && len < min) return `Minimum length is ${min}`;
    if (len > max) return `Maximum length is ${max}`;
    return "";
  }, [error, number, min, max, isRequired]);

  // Sync with parent
  useEffect(() => {
    onChange?.(formatPhone());
    onError?.(phoneError || null);
  }, [number, selectedCountry, phoneError]);

  return (
    <div
      className={`relative formGroup ${phoneError ? "has-error" : ""} ${
        horizontal ? "flex" : ""
      } ${!phoneError && number.length > 0 ? "is-valid" : ""}`}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className={`${classLabel} ${
            horizontal ? "flex-0 mr-6 md:w-[100px] w-[60px] break-words" : ""
          } flex items-center gap-x-1 input-label text-sm text-[#1B2B41B8]`}
        >
          {label} {isRequired && <span className="text-red-500">*</span>}
          {isOptional && <span className="text-[#98A2B3]">(Optional)</span>}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative !flex items-center input-control text-[#667085] !py-0 field-control">
        <AppIcon icon="lucide:phone-call" />

        {/* Country Code Dropdown */}
        <Combobox value={selectedCountry} onChange={setSelectedCountry}>
          <div className="relative">
            <Combobox.Input
              className="pl-3 pr-4 mr-1 text-sm bg-white  py-[10px] outline-none whitespace-nowrap max-w-[70px]"
              displayValue={(country: any) => country?.phone || "+234"}
              placeholder="+234"
              onChange={(e) => setQuery(e.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <AppIcon icon="lucide:chevron-down" />
            </Combobox.Button>

            <Combobox.Options className="absolute z-10 w-[250px] left-0 bg-white border rounded-md shadow-lg max-h-[400px] overflow-y-auto">
              {filteredCountries?.map((country, index) => (
                <Combobox.Option
                  key={`${country.code}+ ${index}`}
                  value={country}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {country.phone} - {country.label}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </div>
        </Combobox>

        {/* Phone Number Input */}
        <div className="relative flex items-center flex-1 z-[1]">
          <input
            type="tel"
            inputMode="numeric"
            value={number}
            disabled={disabled}
            readOnly={readOnly}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, ""); // remove non-digits
              setNumber(numericValue);
            }}
            placeholder={placeholder}
            className="w-full px-3 outline-none"
          />

          {/* Icons */}
          <div className="absolute flex text-xl -translate-y-1/2 top-1/2 right-4">
            {!phoneError && number.length > 0 && (
              <span className="text-green-500">
                <AppIcon icon="bi:check-lg" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error / Success */}
      {phoneError ? (
        <span className="block mt-1 text-sm text-red-500">{phoneError}</span>
      ) : (
        number.length > 0 &&
        validate && (
          <span className="block mt-1 text-sm text-green-500">{validate}</span>
        )
      )}

      {/* Description */}
      {description && (
        <span className="block text-[#475467] font-light leading-4 text-xs mt-2">
          {description}
        </span>
      )}
    </div>
  );
}
