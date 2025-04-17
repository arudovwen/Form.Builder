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
    <div className="grid gap-y-[6px]">
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
