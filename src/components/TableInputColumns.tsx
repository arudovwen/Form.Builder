import React, { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";

export default function TableInputColumn({
  value = [],
  onChange,
  onGetValue,
}: any) {
  // Use the value prop if provided, otherwise use local state
  const [internalValues, setInternalValues] = useState(
    value?.length > 0 ? value : [{ value: "" }]
  );

  // Update internal state when prop value changes
  useEffect(() => {
    if (
      value?.length > 0 &&
      JSON.stringify(value) !== JSON.stringify(internalValues)
    ) {
      setInternalValues(value);
    }
  }, [value]);

  function handleValue(val, index) {
    const newValues = [...internalValues];
    newValues[index] = {
      ...newValues[index],
      value: val,
    };

    setInternalValues(newValues);

    // Pass the updated values to parent component
    if (onChange) {
      onChange(newValues);
    }
  }

  // Add a new row
  function addRow() {
    const newValues = [
      ...internalValues,
      {
        value: "",
      },
    ];

    setInternalValues(newValues);

    // Pass the updated values to parent component
    if (onChange) {
      onChange(newValues);
    }
  }

  // Remove a row
  function removeRow(index) {
    const newValues = internalValues.filter((_, i) => i !== index);

    setInternalValues(newValues);

    // Pass the updated values to parent component
    if (onChange) {
      onChange(newValues);
    }
  }

  // Report changes to parent component via callback
  useEffect(() => {
    if (onGetValue) {
      onGetValue(JSON.stringify({ values: internalValues }));
    }
  }, [onGetValue, internalValues]);

  return (
    <div className="]">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid text-sm font-bold border-b border-gray-100 bg-gray-50">
          <div className="px-2 py-2">
            <span className="">Add Denominations</span>
          </div>
        </div>
        {internalValues?.map((item, index) => (
          <div
            key={index + "index"}
            className="grid text-sm border-b border-gray-100"
          >
            <div className="flex items-center gap-x-4 px-2 py-1">
              <span className="flex-1">
                <CurrencyInput
                  id="input-example"
                  className="border border-gray-100 rounded w-full px-3 py-1 outline-none"
                  decimalsLimit={6}
                  defaultValue={item.value}
                  onValueChange={(e) => handleValue(e, index)}
                  allowNegativeValue={false}
                />
              </span>
              <button
                onClick={() => removeRow(index)}
                className="text-red-500 hover:text-red-700 px-2"
                type="button"
                aria-label="Remove row"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-1 flex justify-end">
        <button
          type="button"
          onClick={addRow}
          className="font-semibold !text-blue-700 text-sm rounded outline-0 focus:outline-0"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
