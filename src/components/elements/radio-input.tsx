import clsx from "clsx";
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
    <div className={clsx("grid gap-y-[6px]", element.customClass)}>
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
               disabled={element.isReadOnly}
            />
          </div>
        )
      )}
    </div>
  );
}
