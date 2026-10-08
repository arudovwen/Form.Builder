import React, { useEffect, useState } from 'react';

type FieldType = {
  key: string;
  label: string;
  value: string;
  type: string;
};

type DynamicInputOptionListProps = {
  initialFields?: FieldType[];
  onChange: (fields: FieldType[]) => void;
};

const DynamicInputOptionList: React.FC<DynamicInputOptionListProps> = ({
  initialFields = [],
  onChange,
}) => {
  const [fields, setFields] = useState<FieldType[]>(initialFields);

  const handleChange = (
    index: number,
    field: keyof FieldType,
    newValue: string
  ) => {
    const updated = [...fields];
    updated[index][field] = newValue;
    setFields(updated);
  };

  const addField = () => {
    setFields([...fields, { key: '', label: '', value: '', type: 'text' }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onChange(fields);
  }, [fields, onChange]);

  return (
    <>
      <div className="mb-10">
        {fields?.map((field, index) => (
          <div key={index} className="flex gap-x-[10px] mb-2">
            <input
              placeholder="Enter Key"
              value={field.key}
              onChange={(e) => handleChange(index, 'key', e.target.value)}
              className="field-control"
            />
            <input
              placeholder="Enter Label"
              value={field.label}
              onChange={(e) => handleChange(index, 'label', e.target.value)}
              className="field-control"
            />
            <select
              aria-label={`Field type selector for field ${index + 1}`}
              value={field.type}
              onChange={(e) => handleChange(index, 'type', e.target.value)}
              className="field-control"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
            <button type="button" onClick={() => removeField(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addField}>
          Add Field
        </button>
      </div>

      {/* Debugging Output */}
      <pre>{JSON.stringify(fields, null, 2)}</pre>
    </>
  );
};

export default DynamicInputOptionList;
