import React from 'react';
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
declare const DynamicInputOptionList: React.FC<DynamicInputOptionListProps>;
export default DynamicInputOptionList;
