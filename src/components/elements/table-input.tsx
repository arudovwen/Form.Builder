import { useEffect } from "react";
import TableInputElement from "../TableInputElement";

export default function TableInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  const { register = () => ({}), setValue, getValues } = validationData || {};
  const registeredValue = getValues && getValues(element?.id) || [];

  useEffect(() => {
    register(element.id);
  }, [element.id, register]);

  return (
    <div>
      <TableInputElement
        onGetTotal={(data) => {
          if (setValue) {
            setValue(element.id, data);
          }
        }}
        denominators={element?.denominators || []}
        defaultValue={registeredValue}
        readOnly={element?.isReadOnly}
      />
    </div>
  );
}
