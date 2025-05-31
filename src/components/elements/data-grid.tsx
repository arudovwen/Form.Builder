import React, { useEffect } from "react";
import CustomDataGrid from "../DataTable";

export default function DataGridInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  const { register = () => ({}), setValue, getValues } = validationData || {};
  const registeredValue = (getValues && getValues(element?.id)) || [];

  useEffect(() => {
    register(element.id);
  }, [element.id, register]);

  console.log('element?.dataColumns', element?.dataColumns)
  return (
    <CustomDataGrid
      value={registeredValue}
      onChange={(value: any)=> setValue(element.id, value)}
      columns={element?.dataColumns}
      isReadOnly
    />
  );
}
