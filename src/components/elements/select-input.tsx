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
  if (watch) {
    const values = watch();
    selectedValue = values[element.id];
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
          onGetValue={(name, option) => {
            setValue?.(name, option?.value ?? "");
            if (trigger) trigger(name);
          }}
          readOnly={validationData?.isReadOnly}
        />
      )}
    </>
  );
}
