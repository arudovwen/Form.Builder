import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  useMemo,
} from "react";
import CurrencyInput from "react-currency-input-field";
import AppIcon from "../ui/AppIcon";
import { v4 as uuidv4 } from "uuid";

/* ---------------- TYPES ---------------- */

export type ColumnType = "text" | "number" | "checkbox";

export interface DataGridColumn<T> {
  field: keyof T;
  headerName?: string;
  editable?: boolean;
  type?: ColumnType;
  validate?: boolean;
  id: string;
}

interface ValidationResult {
  isValid: boolean;
  data?: string | null;
  error?: string | null;
}

interface EditingCell<T> {
  rowId: string;
  field: keyof T;
}

interface CustomDataGridProps<T extends { id: string }> {
  value?: T[];
  onChange?: (rows: T[]) => void;
  isReadOnly?: boolean;
  columns: DataGridColumn<T>[];
  url?: string;
}

/* ================= ROW COMPONENT ================= */

interface RowProps<T extends { id: string }> {
  row: T;
  columns: DataGridColumn<T>[];
  isReadOnly: boolean;
  editingCell: EditingCell<T> | null;
  setEditingCell: React.Dispatch<React.SetStateAction<EditingCell<T> | null>>;
  handleCellChange: (val: unknown, rowId: string, field: keyof T) => void;
  debouncedValidate: (
    val: unknown,
    rowId: string,
    field: keyof T,
    column: DataGridColumn<T>,
  ) => void;
  getValidationStatus: (
    rowId: string,
    field: keyof T,
  ) => {
    isValidating: boolean;
    result?: ValidationResult;
  };
  deleteRow: (rowId: string) => void;
}

function RowComponent<T extends { id: string }>({
  row,
  columns,
  isReadOnly,
  editingCell,
  setEditingCell,
  handleCellChange,
  debouncedValidate,
  getValidationStatus,
  deleteRow,
}: RowProps<T>) {
  const isEditing = (field: keyof T) =>
    editingCell?.rowId === row.id && editingCell?.field === field;

  return (
    <tr>
      {columns.map((col) => {
        const value = row[col.field];
        const editable = col.editable && !isReadOnly;
        const editing = isEditing(col.field);
        const { isValidating, result } = getValidationStatus(row.id, col.field);

        let validationClass = "border-gray-300";

        if (col.validate) {
          if (result?.isValid === false)
            validationClass = "border-red-500 bg-red-50";
          else if (result?.isValid === true)
            validationClass = "border-green-500 bg-green-50";
        }

        const inputClassName = `w-full px-2 py-1 border rounded outline-none ${validationClass}`;

        return (
          <td
            title={isReadOnly ? "" : "Double click to edit"}
            key={String(col.id)}
            className="px-3 py-1 border"
            onDoubleClick={() =>
              editable &&
              setEditingCell({
                rowId: row.id,
                field: col.field,
              })
            }
          >
            {editable && editing ? (
              <div className="relative">
                {col.type === "number" ? (
                  <CurrencyInput
                    value={value as string | number | undefined}
                    decimalsLimit={6}
                    allowNegativeValue={false}
                    className={inputClassName}
                    onValueChange={(val) =>
                      handleCellChange(val, row.id, col.field)
                    }
                    onBlur={() => {
                      setEditingCell(null);
                      debouncedValidate(value, row.id, col.field, col);
                    }}
                    autoFocus
                  />
                ) : col.type === "checkbox" ? (
                  <div className="flex items-center gap-x-4">
                    {(["yes", "no"] as const).map((option) => {
                      const isYes = option === "yes";
                      const radioId = `radio-${row.id}-${String(
                        col.field,
                      )}-${option}`;

                      return (
                        <label
                          key={option}
                          htmlFor={radioId}
                          className="flex items-center gap-1 cursor-pointer"
                        >
                          <input
                            id={radioId}
                            type="radio"
                            name={`boolean-${row.id}-${String(col.field)}`}
                            checked={value === isYes}
                            onChange={() =>
                              handleCellChange(isYes, row.id, col.field)
                            }
                          />
                          <span className="text-sm">
                            {isYes ? "Yes" : "No"}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={String(value ?? "")}
                    onChange={(e) =>
                      handleCellChange(e.target.value, row.id, col.field)
                    }
                    onBlur={() => {
                      setEditingCell(null);
                      debouncedValidate(value, row.id, col.field, col);
                    }}
                    className={inputClassName}
                    autoFocus
                  />
                )}

                {isValidating && (
                  <div className="absolute right-1 top-1">
                    <div className="w-4 h-4 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                )}
              </div>
            ) : col.validate && result ? (
              <div className="flex items-center gap-2">
                <span>
                  {String(value ?? "")} {result.data && `[${result.data}]`}
                </span>
                {result.isValid ? (
                  <span className="text-xs text-green-600">✓</span>
                ) : (
                  <span
                    className="text-xs text-red-600 cursor-help"
                    title={result.error ?? ""}
                  >
                    ✗
                  </span>
                )}
              </div>
            ) : col.type === "checkbox" ? (
              <span className="block py-1 text-gray-700">
                {value === true ? "Yes" : value === false ? "No" : ""}
              </span>
            ) : (
              <span className="block py-1 text-gray-700 cursor-pointer">
                {String(value ?? "")}
              </span>
            )}
          </td>
        );
      })}

      {!isReadOnly && (
        <td className="px-3 py-1 text-center border">
          <button
            type="button"
            onClick={() => deleteRow(row.id)}
            className="text-red-500 hover:text-red-700"
            aria-label="Delete row"
          >
            <AppIcon icon="lets-icons:trash-duotone" iconClass="text-xl" />
          </button>
        </td>
      )}
    </tr>
  );
}

const MemoRow = memo(RowComponent) as typeof RowComponent;

/* ================= MAIN COMPONENT ================= */

export default function CustomDataGrid<T extends { id: string }>({
  value = [],
  onChange,
  isReadOnly = false,
  columns,
}: CustomDataGridProps<T>) {
  const [rows, setRows] = useState<T[]>(value);
  const [editingCell, setEditingCell] = useState<EditingCell<T> | null>(null);

  const tableRef = useRef<HTMLDivElement>(null);

  const formElement = document.getElementById("form");
  const width = useMemo(() => {
    const width = formElement?.getBoundingClientRect().width || 0;
    return width ? width - 48 : width;
  }, [formElement]);

  /* ---- Safe sync external value ---- */
  useEffect(() => {
    setRows((prevRows) => {
      // Only update if value prop is different
      if (JSON.stringify(prevRows) !== JSON.stringify(value)) {
        return value;
      }
      return prevRows;
    });
  }, [value]);

  /* ---- onChange only called inside user actions ---- */
  // handleCellChange, addRow, deleteRow already call onChange

  /* ---- Notify parent safely ---- */
  useEffect(() => {
    onChange?.(rows);
  }, [rows, onChange]);

  /* ---- Outside click ---- */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(e.target as Node)) {
        setEditingCell(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleCellChange = useCallback(
    (val: unknown, rowId: string, field: keyof T) => {
      setRows(
        (prev) =>
          prev.map((row) =>
            row.id === rowId ? { ...row, [field]: val } : row,
          ) as T[],
      );
    },
    [],
  );

  const addRow = useCallback(() => {
    const id = uuidv4();

    const newRow = columns.reduce((acc, col) => {
      (acc as any)[col.field] = col.field === "id" ? id : "";
      return acc;
    }, {} as T);

    setRows((prev) => [...prev, { id, ...newRow }]);
  }, [columns]);

  const deleteRow = useCallback((rowId: string) => {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
  }, []);

  const getValidationStatus = useCallback(
    () => ({
      isValidating: false,
      result: undefined,
    }),
    [],
  );

  return (
    <div className="mt-3 rounded" ref={tableRef}>
      <div className="flex justify-end">
        {!isReadOnly && (
          <button
            onClick={addRow}
            type="button"
            className="px-2 py-1 mb-3 text-xs text-white bg-gray-600 rounded hover:bg-gray-700"
          >
            Add Row
          </button>
        )}
      </div>

      <div
        className="w-full max-w-full overflow-x-auto"
        style={{ maxWidth: `${width}px` }}
      >
        <table className="min-w-max w-full text-sm border-collapse rounded table-auto bg-gray-50">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col: any, idx) => (
                <th
                  key={`${String(col.id)}-${idx}`}
                  className="px-3 py-2 text-xs font-semibold text-left text-gray-600 border whitespace-nowrap"
                >
                  {col.headerName ?? String(col.field)}
                  {col.validate && (
                    <span className="ml-1 text-blue-600">*</span>
                  )}
                </th>
              ))}
              {!isReadOnly && <th className="w-10 px-2 py-2 border"></th>}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <MemoRow
                  key={row.id}
                  row={row}
                  columns={columns}
                  isReadOnly={isReadOnly}
                  editingCell={editingCell}
                  setEditingCell={setEditingCell}
                  handleCellChange={handleCellChange}
                  debouncedValidate={() => {}}
                  getValidationStatus={getValidationStatus}
                  deleteRow={deleteRow}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (isReadOnly ? 0 : 1)}
                  className="p-2 text-xs text-center text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
