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
        className="input-control"
        {...register(element?.id)}
      />
      
    </div>
  );
}
