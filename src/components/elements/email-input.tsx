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
      className="input-control"
      {...register(element.id)}
    />
  );
}
