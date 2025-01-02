import CurrencyInput from 'react-currency-input-field';

export default function AmountInput({ element }: { element: any }) {
  return (
    <CurrencyInput
      placeholder={element.placeholder}
      type={element.inputType}
      className="input-control"
      decimalsLimit={2}
    />
  );
}
