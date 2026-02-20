import { useEffect } from "react";
import PhoneInput from "../PhoneInput";

export default function PhoneNumber({
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
    isReadOnly,
    setError,
    clearErrors,
  } = validationData || {};
  let selectedValue;

  useEffect(() => {
    register(element.id);
  }, [element.id, register]);

  if (watch) {
    const values = watch();
    selectedValue = values[element.id];
  }
  return (
    <PhoneInput
      placeholder={element.placeholder}
      label={""}
      name={element.id}
      value={selectedValue}
      readOnly={isReadOnly}
      disabled={isReadOnly}
      onError={(err) => {
        if (err) {
          setError?.(element.id, { type: "manual", message: err });
        } else {
          clearErrors(element.id);
        }
      }}
      onChange={(data) => {
        if (!data) return;
        setValue?.(element.id, data);

      }}
    />
  );
}
