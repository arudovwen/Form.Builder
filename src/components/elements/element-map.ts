import React from "react";
import DateInput from "./date-input";
import TextInput from "./text-input";
import MultiSelectInput from "./multi-select-input";
import FileInput from "./file-input";
import PasswordInput from "./password-input";
import RadioInput from "./radio-input";
import SectionInput from "./section-input";
import CheckBoxInput from "./checkbox-input";
import SelectInput from "./select-input";
import LongTextInput from "./long-text";
import AmountInput from "./amount-input";
import ValidateInput from "./validate-input";
import TableInput from "./table-input";
import Spacer from "./spacer";
import Divider from "./divider";
import Header from "./header";
import BasicText from "./basic-text";
import DataGridInput from "./data-grid";
import CascadeDropdown from "./cascade-dropdown";
import Rating from "./rating-input";
import MatrixInput from "./matrix-input";
import CountryBank from "./country-bank";
import SignDocument from "./document-sign";
import PhoneNumber from "./phone-input";
import LinkElement from "./link-element";
import CalculatedField from "./calculated-field";
import PollingInput from "./polling-input";

export const elementMap: Record<string, React.FC<any>> = {
  textField: TextInput,
  longText: LongTextInput,
  selectField: SelectInput,
  multiSelect: MultiSelectInput,
  numberField: TextInput,
  amountField: AmountInput,
  date: DateInput,
  password: PasswordInput,
  checkbox: CheckBoxInput,
  radio: RadioInput,
  email: TextInput,
  file: FileInput,
  dataGrid: DataGridInput,
  section: SectionInput,
  validateInput: ValidateInput,
  tableInput: TableInput,
  spacer: Spacer,
  divider: Divider,
  header: Header,
  basicText: BasicText,
  phoneField: PhoneNumber,
  cascadeSelect: CascadeDropdown,
  rating: Rating,
  matrix: MatrixInput,
  country: CountryBank,
  bank: CountryBank,
  document: SignDocument,
  url: LinkElement,
  calculatedField: CalculatedField,
  polling: PollingInput,
};
