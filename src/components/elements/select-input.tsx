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
    isViewer,
  } = validationData || {};
  let selectedValue;
  let selectedLabel;
  if (watch) {
    const values = watch();
    selectedValue = values[element.id];
    const metaData = values[`${element.id}_metaData`];
    selectedLabel = metaData?.label || metaData?.name || element?.metaData?.responseObject?.label;
  }
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
