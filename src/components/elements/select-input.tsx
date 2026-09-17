import { useEffect, useMemo, useRef } from "react";
import CustomSelect from "../CustomSelect";
import clsx from "clsx";
import CustomSearchSelect from "../CustomSearchSelect";
import { getFilteredOptions, getParentFieldValue, isValueInOptions } from "@/utils/optionFiltering";

export default function SelectInput({
  element,
  validationData,
}: {
  element: any;
  validationData?: any;
}) {
  const {
    register = () => ({}),
    trigger,
    setValue,
    watch,
    getValues,
    isViewer,
  } = (validationData as any) || {};

  const selectedValue =
    (watch ? watch(element.id) : undefined) ??
    (getValues ? getValues(element.id) : undefined) ??
    element?.value;

  const watchedMeta = watch ? watch(`${element.id}_metaData`) : undefined;
  const formMeta = getValues ? getValues(`${element.id}_metaData`) : undefined;
  const metaData = watchedMeta || formMeta || element?.metaData?.responseObject;
  const selectedLabel = metaData?.label || metaData?.name;

  useEffect(() => {
    register(element.id);
  }, [element.id, register]);

  // Resolve parent field value for cascading filtering
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

  // Track parent value changes to auto-clear invalid selection
  const isHydratedRef = useRef(false);
  const prevParentValRef = useRef<any>(undefined);

  useEffect(() => {
    if (!element?.filterByFieldId) return;

    // First initialization: capture current parent value without clearing prefilled data
    if (!isHydratedRef.current) {
      if (parentFieldValue !== undefined) {
        isHydratedRef.current = true;
        prevParentValRef.current = parentFieldValue;
      }
      return;
    }

    // Only clear if parent value was already established and changed to a different value
    if (
      prevParentValRef.current !== undefined &&
      prevParentValRef.current !== parentFieldValue
    ) {
      prevParentValRef.current = parentFieldValue;

      if (element.clearOnFilterChange !== false && selectedValue) {
        // Only clear if selectedValue belonged to a specific option that is now filtered out
        const isKnownFilteredOutOption =
          element?.options?.some(
            (opt: any) =>
              (String(opt.value) === String(selectedValue) ||
                String(opt.label) === String(selectedValue)) &&
              Boolean(opt.filterValue || opt.key),
          ) && !isValueInOptions(selectedValue, filteredOptions);

        if (isKnownFilteredOutOption) {
          setValue?.(element.id, "", {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue?.(`${element.id}_metaData`, null);
          if (trigger) trigger(element.id);
        }
      }
    }
  }, [
    element?.filterByFieldId,
    element?.clearOnFilterChange,
    element?.options,
    element.id,
    filteredOptions,
    parentFieldValue,
    selectedValue,
    setValue,
    trigger,
  ]);

  const apiUrl = isViewer ? element.apiUrl : undefined;

  return (
    <>
      {element.selectType === "list" && !isViewer ? (
        <CustomSelect
          options={filteredOptions}
          register={register}
          name={element.id}
          setValue={setValue}
          trigger={trigger}
          value={selectedValue}
          className={clsx("field-control", element?.customClass)}
          disabled={validationData?.isReadOnly}
        />
      ) : (
        <CustomSearchSelect
          name={element.id}
          options={filteredOptions}
          apiUrl={apiUrl}
          value={selectedValue}
          selectedLabel={selectedLabel}
          onGetValue={(name, option) => {
            setValue?.(name, option?.value ?? "");
            if (option) {
              setValue?.(`${name}_metaData`, option);
            }
            if (trigger) trigger(name);
          }}
          readOnly={validationData?.isReadOnly}
        />
      )}
    </>
  );
}
