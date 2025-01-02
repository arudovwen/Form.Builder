import { DynamicInput } from "../forms/dynamic-input";

export default function CheckBoxInput({ element }: { element: any }) {
  return (
    <DynamicInput
      placeholder={element.placeholder}
      type={element.inputType}
      label={element.inputLabel}
      name={""}   />
  );
}
