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

  // Track the last serialized rows we wrote so we skip no-op updates.
  // This is what breaks the loop: CustomDataGrid calls onChange → we call
  // setValue → watch returns a new object reference → value prop changes →
  // CustomDataGrid syncs rows → onChange fires again. The ref short-circuits
  // step 3 when the rows data is identical.
  const prevRowsRef = useRef<string>("");

  const handleChange = useCallback(
    (value: any) => {
      const serialized = JSON.stringify(value);
      if (serialized === prevRowsRef.current) return; // nothing changed
      prevRowsRef.current = serialized;

      setValue?.(element.id, {
        rows: value,
        columns: element?.dataColumns,
      });
    },
    [element.id, element?.dataColumns, setValue],
  );

  return (
    <CustomDataGrid
      value={rows}
      onChange={handleChange}
      columns={element?.dataColumns}
      isReadOnly={isReadOnly}
    />
  );
}
