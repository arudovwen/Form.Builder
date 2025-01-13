// @ts-nocheck 
import { DynamicInput } from "../forms/dynamic-input";

export default function FileInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  return (
    <DynamicInput
      placeholder={element.placeholder}
      type={element.inputType}
      label={""}
      name={""}
      className="file:bg-gray-600 file:text-white file:rounded-[6px] file:py-[6px] file:border-gray-100 !py-1 file:px-[10px] !px-1"
    />
  );
}
