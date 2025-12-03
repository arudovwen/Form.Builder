import clsx from "clsx";
import CustomDatePicker from "../CutomDatePicker";
import { useEffect } from "react";

export default function DateInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  const {
    register = () => ({}),

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
  }, []);
  return (
    <>
      {/* {element.dateType === "basic" ? (
        <input
          placeholder={element.placeholder}
          type={element.inputType}
          className={clsx("field-control", element?.customClass)}
          {...register(element.id)}
          disabled={validationData?.isReadOnly}
        />
      ) : ( */}
      <CustomDatePicker
        name={element.id}
        options={element?.options ?? []}
        defaultValue={selectedValue}
        onGetValue={setValue}
        readOnly={validationData?.isReadOnly}
        dateFormat={element?.dateFormat || "dd/MM/yyyy"}
      />
      {/* )} */}
    </>
  );
}
