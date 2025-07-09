/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import CustomSelect from "../SearchSelect";

type DropdownOption = {
  key?: string;
  value: string;
  label: string;
};

type CascadeDropdownProps = {
  element: {
    id: string;
    customClass?: string;
    name?: string; // single form field name
    options?: DropdownOption[];
    options1?: DropdownOption[];
    childLabel?: string;
  };
  validationData: {
    register?: any;
    trigger?: (name: string) => Promise<boolean>;
    setValue?: (name: string, value: string) => void;
    watch?: (name?: string) => any;
    isReadOnly?: boolean;
  };
};

const CascadeDropdown: React.FC<CascadeDropdownProps> = ({
  element,
  validationData,
}) => {
  const {
    register = () => ({}),
    trigger,
    setValue,
    watch,
    isReadOnly,
  } = validationData || {};
  const fieldName = element?.id ?? "cascadeValue";

  const [selectedFirst, setSelectedFirst] = useState<string>("");
  const [selectedSecond, setSelectedSecond] = useState<string>("");

  // Combine both values into one string: first_second
  const updateCombinedValue = (first: string, second: string) => {
    const combined = first && second ? `${first}_${second}` : "";
    setValue?.(fieldName, combined);
    trigger?.(fieldName);
  };

  // Generic handler for both dropdowns
  const handleDropdownChange = (type: "first" | "second", value: string) => {
    if (type === "first") {
      setSelectedFirst(value);
      setSelectedSecond(""); // reset second when first changes
      updateCombinedValue(value, "");
    } else {
      setSelectedSecond(value);
      updateCombinedValue(selectedFirst, value);
    }
  };

  useEffect(() => {
    // Hydrate from form values if any
    if (watch) {
      const combined = watch(fieldName);
      if (combined?.includes("_")) {
        const [first, second] = combined.split("_");
        setSelectedFirst(first);
        setSelectedSecond(second);
      }
    }
  }, [watch, fieldName]);

  const secondOptions = useMemo(
    () => element.options1?.filter((option) => option.key === selectedFirst),
    [element.options1, selectedFirst]
  );

  if (!element.options || !element.options1) return null; // If options are missing, we return early.

  return (
    <div>
      <input type="hidden" {...register(fieldName)} />

      <div className="relative">
        <CustomSelect
          setValue={(_, value) => handleDropdownChange("first", value)}
          options={element.options}
          name={`${fieldName}`}
          register={register}
          value={selectedFirst}
        />
      </div>

      {selectedFirst && (
        <div className="mt-4">
          {element?.childLabel && (
            <label className="block text-sm text-[#686878] darks:!text-white/70  mb-2">
              {element?.childLabel}
            </label>
          )}
          <CustomSelect
            setValue={(_, value) => handleDropdownChange("second", value)}
            options={secondOptions}
            name={`${fieldName}`}
            register={register}
            value={selectedSecond}
          />
        </div>
      )}
    </div>
  );
};

export default CascadeDropdown;
