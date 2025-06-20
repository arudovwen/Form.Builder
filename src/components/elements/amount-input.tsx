import { DynamicInput } from "../forms/dynamic-input";

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
      disabled={isReadOnly}
    />
  );
}
