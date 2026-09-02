import clsx from "clsx";
import { useState, useEffect } from "react";
import AppIcon from "../ui/AppIcon";

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
    <div className="relative w-full">
      <input
        placeholder={element.placeholder}
        type={show ? "text" : "password"}
        className={clsx("field-control pr-10", element?.customClass, {
          "bg-[#faf8fc]": element.valueSource === "field",
        })}
        {...register(element?.id)}
        disabled={validationData?.isReadOnly || element.valueSource === "field"}
        readOnly={element.valueSource === "field"}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((prev) => !prev)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        title={show ? "Hide password" : "Show password"}
      >
        <AppIcon
          icon={show ? "fluent:eye-off-24-regular" : "fluent:eye-24-regular"}
          iconClass="text-lg"
        />
      </button>
    </div>
  );
}
