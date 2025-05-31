import React, { useState } from "react";
import AppIcon from "../ui/AppIcon";

export default function CustomDataGrid({
  value = [],
  columns = [],
  onChange,
  isReadOnly,
}) {
  const [editingCell, setEditingCell] = useState(null); // { rowIndex, field }

  const handleCellChange = (e, rowIndex, field) => {
    const updatedRows = value.map((row, i) =>
      i === rowIndex ? { ...row, [field]: e.target.value } : row
    );
    onChange?.(updatedRows);
  };

  const addRow = () => {
    const newId =
      value.length > 0
        ? Math.max(...value.map((row) => Number(row.id) || 0)) + 1
        : 1;

    const newRow = columns.reduce(
      (acc, col) => ({
        ...acc,
        [col.field]: col.field === "id" ? newId : "",
      }),
      {}
    );

    onChange?.([...value, newRow]);
  };

  const deleteRow = (index) => {
    const updatedRows = value.filter((_, i) => i !== index);
    onChange?.(updatedRows);
  };

  const isEditing = (rowIndex, field) =>
    editingCell?.rowIndex === rowIndex && editingCell?.field === field;

  return (
    <div className="rounded mt-4">
      <div className="flex justify-end">
        {value.length > 0 && (
          <button
            onClick={addRow}
            className="mb-3 px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
          >
            Add Row
          </button>
        )}
      </div>
      {
        <table className="w-full border-collapse text-sm rounded table-auto">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col) => (
                <th
                  key={col.field}
                  className="border px-3 py-2 text-left font-semibold text-xs text-gray-600"
                >
                  {col.headerName || col.field}
                </th>
              ))}
              <th className="border px-2 py-2 w-10"></th>
            </tr>
          </thead>
          {value.length > 0 && (
            <tbody>
              {value.map((row, rowIndex) => (
                <tr key={row.id ?? rowIndex}>
                  {columns.map((col) => (
                    <td
                      key={col.field}
                      className="border px-3 py-1"
                      onDoubleClick={() =>
                        col.editable &&
                        setEditingCell({ rowIndex, field: col.field })
                      }
                    >
                      {col.editable &&
                      isEditing(rowIndex, col.field) &&
                      !isReadOnly ? (
                        <input
                          autoFocus
                          type="text"
                          value={row[col.field] ?? ""}
                          disabled={isReadOnly}
                          onChange={(e) =>
                            handleCellChange(e, rowIndex, col.field)
                          }
                          onBlur={() => setEditingCell(null)}
                          className="w-full px-2 py-1 border rounded text-gray-600 outline-blue-100 "
                        />
                      ) : (
                        <span className="text-gray-700 cursor-pointer">
                          {row[col.field]}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="border px-2 py-1 text-center">
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
                </tr>
              ))}
            </tbody>
          )}
        </table>
      }
      {value.length === 0 && (
        <div className="text-xs text-center p-2 text-gray-400">
          No data available
        </div>
      )}
    </div>
  );
}
