import { DynamicInput } from "../forms/dynamic-input";

export default function AmountInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  const {register} = validationData 
  return (
    <DynamicInput
      placeholder={element.placeholder}
      type={element.inputType}
      label={""}
      name={element.id}
      register={register}
    />
  );
}
