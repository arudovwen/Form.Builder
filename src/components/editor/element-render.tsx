import React from "react";
import DateInput from "../elements/date-input";
import TextInput from "../elements/text-input";
import MultiSelectInput from "../elements/multi-select-input";
import EmailInput from "../elements/email-input";
import FileInput from "../elements/file-input";
import GridInput from "../elements/grid-input";
import NumberInput from "../elements/number-input";
import PasswordInput from "../elements/password-input";
import RadioInput from "../elements/radio-input";
import SectionInput from "../elements/section-input";
import CheckBoxInput from "../elements/checkbox-input";
import SelectInput from "../elements/select-input";
import { Elements } from "../../utils/contants";



const elementMap: Record<string, React.ElementType> = {
  textField: TextInput,
  longText: TextInput,  // You may want to use a specific component for long text
  selectField: SelectInput,
  multiSelect: MultiSelectInput,
  numberField: NumberInput,
  date: DateInput,
  password: PasswordInput,
  checkbox: CheckBoxInput,
  radio: RadioInput,
  email: EmailInput,
  file: FileInput,
  grid: GridInput,
  section: SectionInput,
};

export const renderElement = (element: { type: string; [key: string]: any }) => {
  const ElementComponent = elementMap[element.type];
  return ElementComponent ? <ElementComponent element={element} state="edit" /> : null;
};

