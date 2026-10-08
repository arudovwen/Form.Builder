/* eslint-disable no-unused-vars */
import React, { useMemo, useState, useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';

type FieldType = {
  key: string;
  label: string;
  value: string;
  type: string;
};

type DynamicInputListProps = {
  initialFields?: FieldType[];
  watch?: (values: Record<string, string>) => void;
  readOnly?: boolean;
  tempDefaultValue?: Record<string, string>;
};

const DynamicInputList: React.FC<DynamicInputListProps> = ({
  initialFields = [],
  watch,
  readOnly = false,
  tempDefaultValue = {},
}) => {
  const [fields, setFields] = useState<FieldType[]>([]);

  useEffect(() => {
    const tempData = initialFields?.map((field) => ({
      ...field,
      value: tempDefaultValue?.[field.key] ?? '',
    }));
    setFields(tempData);
  }, [initialFields, tempDefaultValue]);

  const handleChange = (
    index: number,
    field: keyof FieldType,
    newValue: string | undefined
  ) => {
    if (readOnly) return;
    const updated = [...fields];
    updated[index][field] = newValue ?? '';
    setFields(updated);

    const updatedTransformed = updated.reduce<Record<string, string>>((acc, f) => {
      if (f.key.trim()) acc[f.key] = f.value;
      return acc;
    }, {});

    watch?.(updatedTransformed);
  };

  const transformedFields = useMemo(() => {
    return fields.reduce<Record<string, string>>((acc, field) => {
      if (field.key.trim()) acc[field.key] = field.value;
      return acc;
    }, {});
  }, [fields]);

  return (
    <>
      <div>
        {fields?.map((field, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <label className="block text-sm text-[#686878] darks:!text-white/70 mb-2">
              {field.label}
            </label>
            {field.type === 'number' ? (
              <CurrencyInput
                id={field.key}
                placeholder={`Provide ${field.label?.toLowerCase() || 'value'}`}
                className="field-control"
                decimalsLimit={6}
                defaultValue={field.value}
                onValueChange={(value) => handleChange(index, 'value', value)}
                disabled={readOnly}
                allowNegativeValue={false}
              />
            ) : (
              <input
                placeholder={`Provide ${field.label?.toLowerCase() || 'value'}`}
                value={field.value}
                id={field.key}
                name={field.key}
                type={field.type}
                onChange={(e) => handleChange(index, 'value', e.target.value)}
                readOnly={readOnly}
                className="field-control"
              />
            )}
          </div>
        ))}
      </div>

      {/* Debug preview of transformed object */}
      <h4>Transformed Output:</h4>
      <pre>{JSON.stringify(transformedFields, null, 2)}</pre>
    </>
  );
};

export default DynamicInputList;
