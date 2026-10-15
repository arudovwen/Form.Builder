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
    getValues,
    isReadOnly,
  } = (validationData as any) || {};
  const fieldName = element?.id ?? "cascadeValue";

  const watchedCombined = typeof watch === "function" ? watch(fieldName) : undefined;
  const formCombined = typeof getValues === "function" ? getValues(fieldName) : undefined;
  const currentCombined = (watchedCombined !== undefined ? watchedCombined : formCombined) || "";

  const [selectedFirst, setSelectedFirst] = useState<string>(() => {
    if (typeof currentCombined === "string" && currentCombined.includes("_")) {
      return currentCombined.split("_")[0];
    }
    return "";
  });
  const [selectedSecond, setSelectedSecond] = useState<string>(() => {
    if (typeof currentCombined === "string" && currentCombined.includes("_")) {
      return currentCombined.split("_")[1];
    }
    return "";
  });

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
    // Hydrate from form values whenever currentCombined changes
    if (typeof currentCombined === "string" && currentCombined.includes("_")) {
      const [first, second] = currentCombined.split("_");
      setSelectedFirst(first);
      setSelectedSecond(second);
    } else if (!currentCombined) {
      setSelectedFirst("");
      setSelectedSecond("");
    }
  }, [currentCombined]);

  const secondOptions = useMemo(
    () => element.options1?.filter((option) => option.key === selectedFirst),
    [element.options1, selectedFirst],
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
