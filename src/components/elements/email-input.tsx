import clsx from "clsx";

export default function EmailInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
    const { register = () => ({}) } = validationData || {};
  return (
    <input
      placeholder={element.placeholder}
      type={element.inputType}
      className={clsx("field-control", element?.customClass)}
      {...register(element.id)}
       disabled={validationData?.isReadOnly}
    />
  );
}
