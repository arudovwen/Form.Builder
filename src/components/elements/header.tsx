export default function Header({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {

  const { register = () => ({}) } = validationData || {};
  return (
    <div>
      <input
        placeholder={ "Enter text"}
        type={"text"}
        className="field-control"
        {...register(element?.id)}
      />
      
    </div>
  );
}
