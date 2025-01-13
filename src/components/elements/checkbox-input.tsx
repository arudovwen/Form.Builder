import { DynamicInput } from "../forms/dynamic-input";

export default function CheckBoxInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  return (
    <div className="flex flex-wrap gap-y-4 gap-x-6">
      {element?.options.map((item: { id: string; label: string }) => (
        <div key={item.id}>
          <DynamicInput
            placeholder={element.placeholder}
            type={element.inputType}
            label={item?.label}
            name={""}
          />
        </div>
      ))}
    </div>
  );
}
