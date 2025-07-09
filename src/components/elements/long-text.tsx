import clsx from "clsx";

export default function LongTextInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
    const { register = () => ({}) } = validationData || {};
  return (
    <textarea
      placeholder={element.placeholder}
      rows={4}
      className={clsx("field-control resize-none", element?.customClass)}
      {...register(element.id)}
       disabled={validationData?.isReadOnly}
    ></textarea>
  );
}
