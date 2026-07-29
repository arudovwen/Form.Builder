import clsx from "clsx";
import { useEffect } from "react";

export default function LongTextInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
    const { register = () => ({}), watch, setValue } = validationData || {};

  const isFieldSource = element.valueSource === "field" && element.sourceFieldId;
  const sourceValue = isFieldSource && typeof watch === 'function' ? watch(element.sourceFieldId) : undefined;

  useEffect(() => {
    if (isFieldSource && typeof setValue === 'function') {
      setValue(element.id, sourceValue);
    }
  }, [sourceValue, isFieldSource, element.id, setValue]);

  return (
    <textarea
      placeholder={element.placeholder}
      rows={4}
      className={clsx("field-control resize-none", element?.customClass, {
          "bg-[#faf8fc]": element.valueSource === "field",
      })}
      {...register(element.id)}
       disabled={validationData?.isReadOnly || element.valueSource === "field"}
       readOnly={element.valueSource === "field"}
    ></textarea>
  );
}
