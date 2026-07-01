export type ColumnType = "text" | "number" | "checkbox" | "select";
export interface DataGridColumn<T> {
    field: keyof T;
    headerName?: string;
    editable?: boolean;
    type?: ColumnType;
    validate?: boolean;
    id: string;
    optionsUrl?: string;
    options?: {
        label: string;
        value: string;
    }[];
}
interface CustomDataGridProps<T extends {
    id: string;
}> {
    value?: T[];
    onChange?: (rows: T[]) => void;
    isReadOnly?: boolean;
    columns: DataGridColumn<T>[];
    url?: string;
}
export default function CustomDataGrid<T extends {
    id: string;
}>({ value, onChange, isReadOnly, columns, }: CustomDataGridProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
