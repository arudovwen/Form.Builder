import { DynamicInput } from "../forms/dynamic-input";
import { useEffect } from "react";

export default function AmountInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  const {
    register = () => ({}),
    trigger,
    setValue,
    watch,
    isReadOnly,
  } = validationData || {};
  let selectedValue;
  if (watch) {
    const values = watch();
    selectedValue = values[element.id];
  }

  const isFieldSource = element.valueSource === "field" && element.sourceFieldId;
  const sourceValue = isFieldSource && typeof watch === 'function' ? watch(element.sourceFieldId) : undefined;

  useEffect(() => {
    if (isFieldSource && typeof setValue === 'function') {
      setValue(element.id, sourceValue);
    }
  }, [sourceValue, isFieldSource, element.id, setValue]);

  return (
    <DynamicInput
      placeholder={element.placeholder}
      type={element.inputType}
      label={""}
      name={element.id}
      register={register}
      trigger={trigger}
      setValue={setValue}
      value={selectedValue}
      prefix={element.prefix}
      disabled={isReadOnly || element.valueSource === "field"}
      readOnly={element.valueSource === "field"}
      watch={watch}
      className={element.valueSource === "field" ? "bg-[#faf8fc]" : undefined}
    />
  );
}
