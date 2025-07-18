import React from "react";
import CustomSearchSelect from "../CustomSearchSelect";

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
  let selectedValue;
  const handleSelect = (name: string, selectedValue: any) => {
    setValue?.(name, selectedValue?.value);
    trigger?.(name);
  };
  if (watch) {
    const values = watch();
    selectedValue = values[element.id];
  }
  return (
    <div>
      <input type="hidden" {...register(element.id)} />
      <CustomSearchSelect
        options={element.options}
        onGetValue={handleSelect}
        name={element.id}
        readOnly={isReadOnly}
        defaultValue={selectedValue}
      />
    </div>
  );
}
