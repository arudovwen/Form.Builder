import { useEffect } from "react";
import CustomSelect from "../CustomSelect";
import clsx from "clsx";
import CustomSearchSelect from "../CustomSearchSelect";
// import { ElementType } from "../../utils/contants";

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

  const apiUrl = isViewer ? element.apiUrl : undefined;

  return (
    <>
      {element.selectType === "list" && !isViewer ? (
        <CustomSelect
          options={element?.options ?? []}
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
          options={element?.options ?? []}
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
