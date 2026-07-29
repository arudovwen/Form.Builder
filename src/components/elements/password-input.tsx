import clsx from "clsx";
import { useState, useEffect } from "react";

export default function PasswordInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
    const { register = () => ({}), watch, setValue } = validationData || {};
  const [show, setShow] = useState<boolean>(false);

  const isFieldSource = element.valueSource === "field" && element.sourceFieldId;
  const sourceValue = isFieldSource && typeof watch === 'function' ? watch(element.sourceFieldId) : undefined;

  useEffect(() => {
    if (isFieldSource && typeof setValue === 'function') {
      setValue(element.id, sourceValue);
    }
  }, [sourceValue, isFieldSource, element.id, setValue]);

  return (
    <input
      placeholder={element.placeholder}
      type={element.inputType}
      className={clsx("field-control pr-10", element?.customClass, {
          "bg-[#faf8fc]": element.valueSource === "field",
      })}
      {...register(element?.id)}
      disabled={validationData?.isReadOnly || element.valueSource === "field"}
      readOnly={element.valueSource === "field"}
    />
  );
}
