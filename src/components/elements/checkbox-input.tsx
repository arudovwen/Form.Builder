import { DynamicInput } from "../forms/dynamic-input";

export default function CheckBoxInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  const { register = () => ({}) } = validationData || {};
  return (
    <div className="flex flex-wrap gap-y-4 gap-x-6">
      {element?.options.map(
        (item: { id: string; label: string; value: string }) => (
          <div key={item.id}>
            <DynamicInput
              placeholder={element.placeholder}
              type={element.inputType}
              label={item?.label}
              register={register}
              name={element.id}
              value={item.value}
            />
          </div>
        )
      )}
    </div>
  );
}
