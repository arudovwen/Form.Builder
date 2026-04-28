import React, { useState, useEffect, useCallback, memo } from "react";
import CurrencyInput from "react-currency-input-field";
import AppIcon from "../ui/AppIcon";
import { v4 as uuidv4 } from "uuid";
import { config } from "process";
import { getItem } from "@/utils/localStorageControl";

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
  handleCellChange: (val: unknown, rowId: string, field: keyof T) => void;
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
  handleCellChange,
  getValidationStatus,
  deleteRow,
}: RowProps<T>) {
  return (
    <tr>
      {columns.map((col) => {
        const value = row[col.field];
        const editable = col.editable && !isReadOnly;
        const { isValidating, result } = getValidationStatus(row.id, col.field);

        let validationClass = "border-gray-300";
        if (col.validate) {
          if (result?.isValid === false)
            validationClass = "border-red-500 bg-red-50";
          else if (result?.isValid === true)
            validationClass = "border-green-500 bg-green-50";
        }

        const inputClassName = `w-full py-1 rounded outline-none ${validationClass}`;

        return (
          <td
            key={String(col.id)}
            className="px-3 py-1 border-b border-r last:border-r-0"
          >
            {editable ? (
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
                  />
                ) : col.type === "checkbox" ? (
                  <div className="flex items-center gap-x-4">
                    {(["yes", "no"] as const).map((option) => {
                      const isYes = option === "yes";
                      const radioId = `radio-${row.id}-${String(col.field)}-${option}`;
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
                          <span className="text-sm">{isYes ? "Yes" : "No"}</span>
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
                    className={inputClassName}
                  />
                )}

                {isValidating && (
                  <div className="absolute right-1 top-1">
                    <div className="w-4 h-4 border-2 border-blue-500 rounded-full border-t-transparent animate-spin" />
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
              <span className="block py-1 text-gray-700">
                {String(value ?? "")}
              </span>
            )}
          </td>
        );
      })}

      {!isReadOnly && (
        <td className="px-3 py-1 text-center border sticky right-0 bg-gray-50 z-10">
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
  const config = getItem("config");
  /* ---- Sync external value changes ---- */
  useEffect(() => {
    setRows((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(value)) return value;
      return prev;
    });
  }, [value]);


  const handleCellChange = useCallback(
    (val: unknown, rowId: string, field: keyof T) => {
      setRows((prev) => {
        const next = prev.map((row) =>
          row.id === rowId ? { ...row, [field]: val } : row,
        ) as T[];
        onChange?.(next);
        return next;
      });
    },
    [onChange],
  );

  const addRow = useCallback(() => {
    const id = uuidv4();
    const newRow = columns.reduce((acc, col) => {
      (acc as any)[col.field] = col.field === "id" ? id : "";
      return acc;
    }, {} as T);
    setRows((prev) => {
      const next = [...prev, { id, ...newRow }];
      onChange?.(next);
      return next;
    });
  }, [columns, onChange]);

  const deleteRow = useCallback((rowId: string) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== rowId);
      onChange?.(next);
      return next;
    });
  }, [onChange]);

  const getValidationStatus = useCallback(
    (_rowId: string, _field: keyof T) => ({
      isValidating: false,
      result: undefined as ValidationResult | undefined,
    }),
    [],
  );

  return (
    <div className="mt-3 rounded">
      <div className="w-full max-w-full overflow-x-auto border rounded-lg">
        <table className="min-w-max w-full text-sm border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col, idx) => (
                <th
                  key={`${String(col.id)}-${idx}`}
                  className="px-3 py-2 text-xs font-semibold text-left text-gray-600 border-b whitespace-nowrap"
                >
                  {col.headerName ?? String(col.field)}
                  {col.validate && (
                    <span className="ml-1 text-blue-600">*</span>
                  )}
                </th>
              ))}
              {!isReadOnly && (
                <th className="w-10 px-2 py-2 border sticky right-0 bg-gray-100 z-10" />
              )}
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
                  handleCellChange={handleCellChange}
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

      {!isReadOnly && (
        <div className="flex justify-center mt-2">
          <button
            onClick={addRow}
            type="button"
             style={{ color: config?.buttonColor || "#333" }}
            className="px-2 py-1 mb-3 text-xs text-gray-600 font-medium"
          >
            + Add Row
          </button>
        </div>
      )}
    </div>
  );
}
