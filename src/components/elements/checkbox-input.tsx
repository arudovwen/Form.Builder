import { useMemo, useEffect, useRef } from "react";
import clsx from "clsx";
import { DynamicInput } from "../forms/dynamic-input";
import {
  getFilteredOptions,
  getParentFieldValue,
  isValueInOptions,
  pruneSelectedValues,
} from "@/utils/optionFiltering";

export default function CheckBoxInput({
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

  const isSingle =
    element?.selectionType === "single" ||
    element?.isMultiple === false;

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

  // Prune invalid selected values when parent value changes
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

      if (element.clearOnFilterChange !== false) {
        const currentVal = (watch ? watch(element.id) : undefined) ?? (getValues ? getValues(element.id) : undefined);
        if (currentVal !== undefined && currentVal !== null && currentVal !== "") {
          if (Array.isArray(currentVal)) {
            const pruned = pruneSelectedValues(currentVal, filteredOptions);
            if (pruned.length !== currentVal.length) {
              setValue?.(element.id, pruned, {
                shouldValidate: true,
                shouldDirty: true,
              });
              if (trigger) trigger(element.id);
            }
          } else if (typeof currentVal === "string" && currentVal.startsWith("[")) {
            try {
              const parsed = JSON.parse(currentVal);
              if (Array.isArray(parsed)) {
                const pruned = pruneSelectedValues(parsed, filteredOptions);
                if (pruned.length !== parsed.length) {
                  setValue?.(element.id, pruned, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  if (trigger) trigger(element.id);
                }
              }
            } catch {}
          } else if (!isValueInOptions(currentVal, filteredOptions)) {
            setValue?.(element.id, "", {
              shouldValidate: true,
              shouldDirty: true,
            });
            if (trigger) trigger(element.id);
          }
        }
      }
    }
  }, [
    element?.filterByFieldId,
    element?.clearOnFilterChange,
    element.id,
    filteredOptions,
    parentFieldValue,
    setValue,
    trigger,
    watch,
    getValues,
  ]);

  const handleSingleCheck = (itemValue: string) => {
    if (validationData?.isReadOnly) return;
    const currentVal = watch?.(element.id);

    // Normalize: if stored as JSON array string, parse it first
    let normalized = currentVal;
    if (typeof currentVal === "string" && currentVal.trim().startsWith("[")) {
      try {
        normalized = JSON.parse(currentVal);
      } catch {}
    }

    const isCurrentlyChecked = Array.isArray(normalized)
      ? normalized.includes(itemValue)
      : normalized == itemValue;

    // Single-selection: store as a plain string (not an array)
    const newVal = isCurrentlyChecked ? "" : itemValue;
    setValue?.(element.id, newVal, { shouldValidate: true, shouldDirty: true });
    trigger?.(element.id);
  };

  return (
    <div className={clsx("grid gap-y-[6px]", element.customClass)}>
      {filteredOptions?.map(
        (item: { id: string; label: string; value: string }) => (
          <div key={item.id}>
            <DynamicInput
              placeholder={element.placeholder}
              type={element.inputType}
              label={item?.label}
              // In single-check mode, bypass RHF's native checkbox registration
              // to prevent cross-field interference; state is managed via setValue/watch
              register={isSingle ? undefined : register}
              name={element.id}
              value={item.value}
              disabled={validationData?.isReadOnly}
              watch={watch}
              onChange={
                isSingle
                  ? (_e) => {
                      handleSingleCheck(item.value);
                    }
                  : undefined
              }
            />
          </div>
        )
      )}
    </div>
  );
}
