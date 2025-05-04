import React, { useState, useMemo, useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';

export default function TableInputElement({
  onGetTotal,
  readOnly,
  defaultValue,
  denominators,
}) {
  const [values, setValues] = useState([...defaultValue]);

  function handleValue(val, index) {
    setValues((prev) => {
      const newValues = [...prev];
      newValues[index] = {
        ...newValues[index],
        value: val,
      };
      return newValues;
    });
  }

  // Calculate subtotal based on value (assuming value is a number)
  function calculateSubtotal(key, value) {
    return parseFloat(key) * parseFloat(value) || 0;
  }

  // Calculate total of all subtotals
  const total = useMemo(
    () => values.reduce((sum, item) => {
        const subtotal = calculateSubtotal(item.key, item.value);
        return sum + subtotal;
      }, 0),
    [values],
  );

  useEffect(() => {
    if (onGetTotal) {
      onGetTotal(values);
    }
  }, [values]);

  useEffect(() => {
    if (denominators?.length) {
      const tempValues = denominators.map((i, index) => ({
        key: i.value,
        value:
          Array.isArray(defaultValue) && defaultValue[index]
            ? defaultValue[index].value
            : '',
      }));
      setValues(tempValues);
    }
  }, [defaultValue, denominators]);

  return (
    <div className='mt-2'>
      <div className="border border-gray-200 rounded-lg overflow-hidden text-gray-700">
        <div className="grid grid-cols-3 text-sm font-bold border-b border-gray-100 bg-gray-50">
          <div className="border-r px-4 py-2">
            <span className="">Denomination</span>
          </div>
          <div className="border-r px-4 py-2">
            <span>Quantity</span>
          </div>
          <div className="px-4 py-2">
            <span>Sub total</span>
          </div>
        </div>
        {values.map((item, index) => (
          <div
          key={item.key + index + Math.random()}
            className="grid grid-cols-3 text-sm border-b border-gray-100"
          >
            <div className="border-r px-4 py-2 flex items-center">
              <span className="">{parseFloat(item.key)?.toLocaleString()}</span>
            </div>
            <div className="border-r px-4 py-1">
              <span>
                {/* <input
                  type="number"
                  className="border border-gray-100 rounded w-full px-3 py-1 outline-none"
                  value={item.value}
                  onChange={(e) => handleValue(e.target.value, index)}
                  disabled={readOnly}
                  readOnly={readOnly}
                  min={0}
                /> */}
                <CurrencyInput
                  id="input-example"
                  className="border border-gray-100 rounded w-full px-3 py-1 outline-none"
                  decimalsLimit={6}
                  defaultValue={item.value}
                  onValueChange={(e) => handleValue(e, index)}
                  disabled={readOnly}
                  allowNegativeValue={false}
                />
              </span>
            </div>
            <div className="px-4 py-2 flex justify-between items-center">
              <span>
                {calculateSubtotal(item.key, item.value)?.toLocaleString()}
              </span>
              {/* <button
                onClick={() => removeRow(index)}
                className="text-red-500 hover:text-red-700 px-2"
                type="button"
                aria-label="Remove row"
              >
                ×
              </button> */}
            </div>
          </div>
        ))}

        {/* Total row */}
        <div className="grid grid-cols-3 text-sm font-bold bg-gray-50">
          <div className="border-r px-4 py-3 col-span-2 text-right">Total</div>
          <div className="px-4 py-3">{total?.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
