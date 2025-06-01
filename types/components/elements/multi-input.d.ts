import React from 'react';
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
declare const DynamicInputList: React.FC<DynamicInputListProps>;
export default DynamicInputList;
