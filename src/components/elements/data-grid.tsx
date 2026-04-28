import React, { useCallback, useEffect, useRef } from "react";
import CustomDataGrid from "../DataTable";

export default function DataGridInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  const {
    register = () => ({}),
    setValue,
    watch,
    isReadOnly,
  } = validationData || {};

  // registeredValue may be { rows, columns } or a plain array (legacy)
  const registeredValue = (watch && watch(element?.id)) || {};
  const rows = Array.isArray(registeredValue)
    ? registeredValue
    : registeredValue?.rows ?? [];

  useEffect(() => {
    register(element.id);
  }, [element.id, register]);

  // Keep latest values in refs so handleChange stays stable across renders.
  // An unstable handleChange would cascade into DataTable rebuilding all its
  // callbacks (handleCellChange, addRow, deleteRow) on every keystroke.
  const prevRowsRef = useRef<string>("");
  const elementIdRef = useRef(element?.id);
  const dataColumnsRef = useRef(element?.dataColumns);
  const setValueRef = useRef(setValue);
  elementIdRef.current = element?.id;
  dataColumnsRef.current = element?.dataColumns;
  setValueRef.current = setValue;

  const handleChange = useCallback((value: any) => {
    const serialized = JSON.stringify(value);
    if (serialized === prevRowsRef.current) return; // nothing changed
    prevRowsRef.current = serialized;

    setValueRef.current?.(elementIdRef.current, {
      rows: value,
      columns: dataColumnsRef.current,
    });
  }, []); // stable — reads latest values via refs

  return (
    <CustomDataGrid
      value={rows}
      onChange={handleChange}
      columns={element?.dataColumns}
      isReadOnly={isReadOnly}
    />
  );
}
