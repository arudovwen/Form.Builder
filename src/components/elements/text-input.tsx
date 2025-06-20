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
        className={clsx("input-control", element?.customClass)}
        {...register(element?.id)}
        disabled={validationData.isReadOnly}
      />
    </div>
  );
}
