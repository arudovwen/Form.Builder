import clsx from "clsx";

export default function DateInput({
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
      className={clsx("input-control", element?.customClass)}
      {...register(element.id)}
    />
  );
}
