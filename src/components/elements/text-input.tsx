import clsx from "clsx";
import { useEffect } from "react";
export default function TextInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
  state?: string;
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
    <div>
      <input
        placeholder={element?.placeholder || ""}
        type={element?.inputType || "text"}
        className={clsx("field-control", element?.customClass, {
            "bg-[#faf8fc]": element.valueSource === "field",
        })}
        {...register(element?.id)}
        disabled={validationData?.isReadOnly || element.valueSource === "field"}
        readOnly={element.valueSource === "field"}
        inputMode={element?.inputMode || undefined}
        aria-invalid={!!validationData?.errors?.[element?.id]}
        pattern={element?.pattern || undefined}
      />
    </div>
  );
}
