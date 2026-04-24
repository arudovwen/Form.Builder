import clsx from "clsx";

export default function MatrixInput({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
}) {
  const { register = () => ({}) } = validationData || {};
  const rows = element?.options || [];
  const columns = element?.options1 || [];

  return (
    <div className={clsx("w-full overflow-x-auto", element.customClass)}>
      <table className="w-full text-left border-collapse min-w-[600px] mb-2">
        <thead>
          <tr>
            <th className="p-3 border-b bg-gray-50/50"></th>
            {columns.map((col: any) => (
              <th
                key={col.id || col.value}
                className="p-3 font-medium text-center border-b text-xs text-gray-700 w-[12%]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any) => (
            <tr
              key={row.id || row.value}
              className="border-b last:border-0 hover:bg-gray-50/30"
            >
              <td className="p-3 text-gray-700 min-w-[150px] text-sm">{row.label}</td>
              {columns.map((col: any) => (
                <td key={col.id || col.value} className="p-3 text-center align-middle">
                  <input
                    type="radio"
                    value={col.value}
                    disabled={element.isDisabled || validationData?.isReadOnly}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                    {...register(`${element.id}.${row.value}`)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
