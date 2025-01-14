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
      className="input-control resize-none"
      {...register(element.id)}
    ></textarea>
  );
}
