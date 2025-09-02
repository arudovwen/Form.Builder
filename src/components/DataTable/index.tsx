import React, { useEffect, useState } from "react";
import AppIcon from "../ui/AppIcon";
import CurrencyInput from "react-currency-input-field";

export default function CustomDataGrid({
  value = [],
  onChange,
  isReadOnly,
  columns = [],
}) {
  const [rows, setRows] = useState(value);
  const [editingCell, setEditingCell] = useState(null); // { rowIndex, field }

  // Keep local rows in sync with value prop
  useEffect(() => {
    setRows(value);
  }, []);

  const handleCellChange = (val, rowIndex, field) => {
    const updated = rows.map((row, i) => (i === rowIndex ? { ...row, [field]: val } : row));
    setRows(updated);

    if (onChange) onChange(updated);
  };

  const addRow = () => {
    const newId =
      rows.length > 0
        ? Math.max(...rows.map((row) => Number(row.id) || 0)) + 1
        : 1;

    const newRow = columns.reduce(
      (acc, col) => ({
        ...acc,
        [col.field]: col.field === 'id' ? newId : '',
      }),
      {},
    );
    const updated = [...rows, newRow];
    setRows(updated);
    if (onChange) onChange(updated);
  };

  const deleteRow = (index) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
    if (onChange) onChange(updated);
  };

  const isEditing = (rowIndex, field) => editingCell?.rowIndex === rowIndex && editingCell?.field === field;

  return (
    <div className="mt-4 rounded">
      <div className="flex justify-end">
        {columns?.length > 0 && !isReadOnly && (
          <button
            onClick={addRow}
            type="button"
            className="px-2 py-1 mb-3 text-xs text-white bg-gray-600 rounded hover:bg-gray-700"
          >
            Add Row
          </button>
        )}
      </div>

      <table className="w-full text-sm border-collapse rounded table-auto bg-gray-50">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th
                key={col.field}
                className="px-3 py-2 text-xs font-semibold text-left text-gray-600 border"
              >
                {col.headerName || col.field}
              </th>
            ))}
            {!isReadOnly && <th className="w-10 px-2 py-2 border"></th>}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <tr key={row.id ?? rowIndex}>
                {columns.map((col) => (
                  <td
                    key={col.field}
                    className="px-2 py-1 border"
                    onDoubleClick={() => col.editable &&
                      !isReadOnly &&
                      setEditingCell({ rowIndex, field: col.field })
                    }
                  >
                    {col.editable &&
                    isEditing(rowIndex, col.field) &&
                    !isReadOnly ? (
                      <>
                        {col.type === 'number' ? (
                          <CurrencyInput
                            value={row[col.field] ?? ''}
                            onValueChange={(val) => handleCellChange(val, rowIndex, col.field)
                            }
                            decimalsLimit={6}
                            allowNegativeValue={false}
                            placeholder=""
                            className="w-full px-2 py-1 border rounded outline-none"
                          />
                        ) : (
                          <input
                            autoFocus
                            type="text"
                            value={row[col.field] ?? ''}
                            onChange={(e) => handleCellChange(
                                e.target.value,
                                rowIndex,
                                col.field,
                              )
                            }
                            onBlur={() => setEditingCell(null)}
                            className="w-full px-2 py-1 text-gray-600 border rounded outline-none"
                          />
                        )}
                      </>
                    ) : (
                      <span className="block py-1 text-gray-700 cursor-pointer">
                        {row[col.field]}
                      </span>
                    )}
                  </td>
                ))}
                {!isReadOnly && (
                  <td className="px-2 py-1 text-center border">
                    <button
                      onClick={() => deleteRow(rowIndex)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete row"
                    >
                       <AppIcon
                          icon="lets-icons:trash-duotone"
                          iconClass="text-xl"
                        />
                    </button>
                  </td>
                )}
              </tr>
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
  );
}