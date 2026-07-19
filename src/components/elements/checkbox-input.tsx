import clsx from "clsx";
import { DynamicInput } from "../forms/dynamic-input";

export default function CheckBoxInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  const { register = () => ({}), watch, setValue, getValues } = validationData || {};
  
  const currentValues = watch ? watch(element.id) : getValues?.(element.id) || [];
  const selectedValues = Array.isArray(currentValues) ? currentValues : (currentValues ? [currentValues] : []);
  const allValues = element?.options?.map((o: any) => o.value) || [];
  const isAllSelected = selectedValues.length === allValues.length && allValues.length > 0;

  return (
    <div className={clsx("grid gap-y-[6px]", element.customClass)}>
      {element?.options?.map(
        (item: { id: string; label: string; value: string }) => (
          <div key={item.id}>
            <DynamicInput
              placeholder={element.placeholder}
              type={element.inputType}
              label={item?.label}
              register={register}
              name={element.id}
              value={item.value}
              disabled={validationData?.isReadOnly}
              watch={watch}
            />
          </div>
        )
      )}
    </div>
  );
}
