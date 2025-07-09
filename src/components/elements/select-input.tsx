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
  } = validationData || {};
  let selectedValue;
  if (watch) {
    const values = watch();
    selectedValue = values[element.id];
  }
  useEffect(() => {
    register(element.id);
  }, [element.id, register]);

  return (
    <>
      {element.selectType === "list" ? (
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
          defaultValue={selectedValue}
          onGetValue={setValue}
          readOnly={validationData?.isReadOnly}
        />
      )}
    </>
  );
}
