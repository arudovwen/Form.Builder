import { DynamicInput } from "../forms/dynamic-input";

export default function AmountInput({ element }: { element: any }) {
  return (
    <DynamicInput
      placeholder={element.placeholder}
      type={element.inputType}
      label={""}
      name={""}
    />
  );
}
