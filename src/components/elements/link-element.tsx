import clsx from "clsx";
export default function LinkElement({
  element,
  validationData,
}: {
  element: any;
  validationData: any;
  state?: string;
}) {
  const { register = () => ({}), watch } = validationData || {};
  let selectedValue;
  if (watch) {
    const values = watch();
    selectedValue = values[element.id];
  }

  return (
    <div>
      <input
        placeholder={element?.placeholder || "Enter Url link"}
        className={clsx("field-control", element?.customClass)}
        {...register(element?.id)}
        disabled={validationData?.isReadOnly}
      />
      {selectedValue && (
        <div
          className={
            validationData?.isReadOnly
              ? "field-control !bg-gray-50 mt-1"
              : "mt-1 text-xs"
          }
        >
          <a
            title="Visit link"
            target="_blank"
            className="hover:underline text-blue-700"
            href={selectedValue}
          >
            {selectedValue}
          </a>
        </div>
      )}
    </div>
  );
}
