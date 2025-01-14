import { DynamicInput } from "../forms/dynamic-input";

export default function RadioInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
    const { register = () => ({}) } = validationData || {};
  return (
    <div className="flex flex-wrap gap-y-4 gap-x-6">
      {element?.options.map((item: { id: string; label: string }) => (
        <div key={item.id}>
          <DynamicInput
            placeholder={element.placeholder}
            type={element.inputType}
            label={item?.label}
            name={""}
            {...register(element.id)}
          />
        </div>
      ))}
    </div>
  );
}
