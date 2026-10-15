declare const fieldTypes: readonly ["text", "number", "boolean"];
type FieldType = (typeof fieldTypes)[number];
export declare const inferFieldType: (question: any) => FieldType;
export declare const getOperatorsForType: (type: FieldType | string) => string[];
export interface VisibilityRule {
    id: string;
    value: string;
    label: string;
    sectionId?: string;
    fieldType: FieldType;
    operator: string;
    fieldValue: any;
}
export default function VisibilityEditor({ register, setValue, trigger, watch, id, }: any): import("react/jsx-runtime").JSX.Element;
export {};
