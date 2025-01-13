import React from "react";
import CustomSelect from "../CustomSelect";
import { ElementType } from "../../utils/contants";

export default function SelectInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  const { register } = validationData;
  return (
    <div>
      <CustomSelect options={element?.options ?? []} name={""} />
    </div>
  );
}
