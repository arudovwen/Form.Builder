import React from "react";
import DateInput from "../elements/date-input";
import TextInput from "../elements/text-input";
import MultiSelectInput from "../elements/multi-select-input";
import EmailInput from "../elements/email-input";
import FileInput from "../elements/file-input";
import NumberInput from "../elements/text-input";
import PasswordInput from "../elements/password-input";
import RadioInput from "../elements/radio-input";
import SectionInput from "../elements/section-input";
import CheckBoxInput from "../elements/checkbox-input";
import SelectInput from "../elements/select-input";
import LongTextInput from "../elements/long-text";
import ElementContainer from "../elements/element-container";
import AmountInput from "../elements/amount-input";
import ValidateInput from "../elements/validate-input";
import TableInput from "../elements/table-input";
import Spacer from "../elements/spacer";
import Divider from "../elements/divider";
import Header from "../elements/header";
import BasicText from "../elements/basic-text";

export const elementMap: Record<string, React.ElementType> = {
  textField: TextInput,
  longText: LongTextInput, // You may want to use a specific component for long text
  selectField: SelectInput,
  multiSelect: MultiSelectInput,
  numberField: NumberInput,
  amountField: AmountInput,
  date: DateInput,
  password: PasswordInput,
  checkbox: CheckBoxInput,
  radio: RadioInput,
  email: EmailInput,
  file: FileInput,
  // grid: GridInput,
  section: SectionInput,
  validateInput: ValidateInput,
  tableInput: TableInput,
  spacer: Spacer,
  divider: Divider,
  header: Header,
  basicText: BasicText,
};
const state = "edit"; // This can be passed as a prop or context value
export const renderElement = (element: any, sectionId: string) => {
  const ElementComponent = elementMap[element.type];
  return ElementComponent ? (
    <ElementContainer element={element} state={state}>
      <div className="relative w-full">
        {element.type.toLowerCase() !== "grid" && (
          <div className="absolute top-0 left-0 h-full w-full z-20" />
        )}
        <ElementComponent
          element={element}
          state={state}
          sectionId={sectionId}
        />
      </div>
    </ElementContainer>
  ) : null;
};
