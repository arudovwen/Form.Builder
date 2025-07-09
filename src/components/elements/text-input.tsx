import clsx from "clsx";
export default function TextInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
  state?: string;
}) {
  const { register = () => ({}) } = validationData || {};
  return (
    <div>
      <input
        placeholder={element?.placeholder || ""}
        type={element?.inputType || "text"}
        className={clsx("field-control", element?.customClass)}
        {...register(element?.id)}
        disabled={validationData?.isReadOnly}
        inputMode={element?.inputMode || undefined}
        aria-invalid={!!validationData?.errors?.[element?.id]}
        pattern={element?.pattern || undefined}
      />
    </div>
  );
}
