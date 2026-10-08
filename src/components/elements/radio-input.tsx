import { useMemo, useEffect, useRef } from "react";
import clsx from "clsx";
import { DynamicInput } from "../forms/dynamic-input";
import {
  getFilteredOptions,
  getParentFieldValue,
  isValueInOptions,
} from "@/utils/optionFiltering";

export default function RadioInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  const {
    register = () => ({}),
    watch,
    getValues,
    setValue,
    trigger,
  } = validationData || {};

  const parentFieldValue = getParentFieldValue(
    element?.filterByFieldId,
    validationData,
  );

  const filteredOptions = useMemo(() => {
    return getFilteredOptions(
      element?.options ?? [],
      element?.filterByFieldId,
      parentFieldValue,
    );
  }, [element?.options, element?.filterByFieldId, parentFieldValue]);

  const selectedValue =
    (watch ? watch(element.id) : undefined) ??
    (getValues ? getValues(element.id) : undefined) ??
    element?.value;

  const isHydratedRef = useRef(false);
  const prevParentValRef = useRef<any>(undefined);

  useEffect(() => {
    if (!element?.filterByFieldId) return;

    if (!isHydratedRef.current) {
      if (parentFieldValue !== undefined) {
        isHydratedRef.current = true;
        prevParentValRef.current = parentFieldValue;
      }
      return;
    }

    if (
      prevParentValRef.current !== undefined &&
      prevParentValRef.current !== parentFieldValue
    ) {
      prevParentValRef.current = parentFieldValue;

      if (
        element.clearOnFilterChange !== false &&
        selectedValue &&
        !isValueInOptions(selectedValue, filteredOptions)
      ) {
        setValue?.(element.id, "", { shouldValidate: true, shouldDirty: true });
        if (trigger) trigger(element.id);
      }
    }
  }, [
    element?.filterByFieldId,
    element?.clearOnFilterChange,
    element.id,
    filteredOptions,
    parentFieldValue,
    selectedValue,
    setValue,
    trigger,
  ]);

  return (
    <div className={clsx("grid gap-y-[6px]", element.customClass)}>
      {filteredOptions?.map(
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
