import React, { useCallback, useEffect } from "react";
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
  const registeredValue = (watch && watch(element?.id)) || [];

  useEffect(() => {
    register(element.id);
  }, [element.id, register]);
  const handleChange = useCallback(
    (value: any) => {
      setValue?.(element.id, value);
    },
    [element.id, setValue],
  );
  return (
    <CustomDataGrid
      value={registeredValue}
      onChange={handleChange}
      columns={element?.dataColumns}
      isReadOnly={isReadOnly}
    />
  );
}
