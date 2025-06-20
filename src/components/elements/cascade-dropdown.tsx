/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import clsx from "clsx";

type CascadeDropdownProps = {
  element: any;
  validationData: {
    register?: () => any;
    trigger?: any;
    setValue?: any;
    watch?: () => Record<string, any>;
    isReadOnly?: boolean;
  };
};

const CascadeDropdown: React.FC<CascadeDropdownProps> = ({
  element,
  validationData,
  firstDropdownOptions,
  secondDropdownOptions,
}: any) => {
  const {
    register = () => ({}),
    trigger,
    setValue,
    watch,
    isReadOnly,
  } = validationData || {};

  //   // Sample data for dropdown 1 (first-level categories)
  //   const firstDropdownOptions = [
  //     { key: 'fruits', label: 'Fruits', value: 'fruits' },
  //     { key: 'vegetables', label: 'Vegetables', value: 'vegetables' },
  //   ];

  //   // Sample data for dropdown 2 (second-level categories)
  //   const secondDropdownOptions: Record<string, { key: string; label: string; value: string }[]> = {
  //     fruits: [
  //       { key: 'apple', label: 'Apple', value: 'apple' },
  //       { key: 'banana', label: 'Banana', value: 'banana' },
  //       { key: 'orange', label: 'Orange', value: 'orange' },
  //     ],
  //     vegetables: [
  //       { key: 'carrot', label: 'Carrot', value: 'carrot' },
  //       { key: 'broccoli', label: 'Broccoli', value: 'broccoli' },
  //       { key: 'spinach', label: 'Spinach', value: 'spinach' },
  //     ],
  //   };

  // State to manage the selected value from both dropdowns
  const [selectedFirst, setSelectedFirst] = useState("");
  const [selectedSecond, setSelectedSecond] = useState("");

  // Handle the first dropdown change
  const handleFirstDropdownChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedFirst(e.target.value);
    setSelectedSecond(""); // Reset second dropdown when first changes
  };

  // Handle the second dropdown change
  const handleSecondDropdownChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSecond(e.target.value);
  };

  return (
    <div className="">
      {/* First Dropdown */}
      <div>
        <select
          id="first-dropdown"
          value={selectedFirst}
          onChange={handleFirstDropdownChange}
          className={clsx("input-control", element?.customClass)}
          disabled={validationData.isReadOnly}
        >
          <option value="">Select an option</option>
          {firstDropdownOptions?.map((option) => (
            <option key={option.key} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Second Dropdown (Filtered based on first dropdown selection) */}
      {selectedFirst && (
        <div className="mt-4">
          <select
            id="second-dropdown"
            value={selectedSecond}
            onChange={handleSecondDropdownChange}
            className={clsx("input-control", element?.customClass)}
            disabled={validationData.isReadOnly}
          >
            <option value="">Select an option</option>
            {secondDropdownOptions?.[selectedFirst]?.map((option) => (
              <option key={option.key} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CascadeDropdown;
