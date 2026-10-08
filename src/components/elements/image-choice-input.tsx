import React, { useMemo, useEffect, useRef } from "react";
import AppIcon from "../ui/AppIcon";
import clsx from "clsx";
import {
  getFilteredOptions,
  getParentFieldValue,
  isValueInOptions,
} from "@/utils/optionFiltering";

const ImageChoiceInput = ({ element, state, validationData }: any) => {
  const { isReadOnly, register, watch, getValues, setValue, trigger } =
    validationData || {};

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
    typeof watch === "function"
      ? watch(element.id)
      : typeof getValues === "function"
        ? getValues(element.id)
        : undefined;

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

  const handleSelect = (val: string) => {
    if (isReadOnly || state === "edit") return;
    if (typeof setValue === "function") {
      setValue(element.id, val, { shouldValidate: true, shouldDirty: true });
      if (trigger) trigger(element.id);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4 mt-2">
        {filteredOptions?.map((opt: any) => (
          <div
            key={opt.id}
            onClick={() => handleSelect(opt.value)}
            className={clsx(
              "relative rounded-xl border-2 overflow-hidden cursor-pointer group transition-colors shadow-sm",
              selectedValue === opt.value
                ? "border-[#6366f1] ring-2 ring-[#6366f1]/20"
                : "border-gray-100 hover:border-[#6366f1]",
            )}
          >
            <div className="aspect-video bg-gray-50 flex items-center justify-center text-gray-300 relative">
              {opt.imageUrl ? (
                <img
                  src={opt.imageUrl}
                  alt={opt.label}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <AppIcon
                  icon="mdi:image-outline"
                  iconClass="w-12 h-12 group-hover:text-[#6366f1] transition-colors"
                />
              )}
            </div>
            <div
              className={clsx(
                "p-3 text-center text-sm font-medium",
                selectedValue === opt.value
                  ? "bg-[#6366f1] text-white"
                  : "bg-white text-gray-700",
              )}
            >
              {opt.label}
            </div>
          </div>
        ))}
      </div>
      {/* Hidden input to hook into react-hook-form validation */}
      {typeof register === "function" && (
        <input type="hidden" {...register(element.id)} />
      )}
    </div>
  );
};

export default ImageChoiceInput;
