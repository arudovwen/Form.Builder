export default function TextInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {

  const { register } = validationData;
  return (
   <div>
     <input
      placeholder={element.placeholder}
      type={element.inputType}
      className="input-control"
      {...register(element.id)}
    />
   </div>
  );
}
