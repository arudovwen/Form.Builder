import React from "react";
import CustomSelect from "../CustomSelect";
import { ElementType } from "../../utils/contants";

export default function SelectInput({ element }: { element: ElementType }) {
  return (
    <div>
      <CustomSelect
        options={element?.options ?? []}
        name={""}
      />
    </div>
  );
}
