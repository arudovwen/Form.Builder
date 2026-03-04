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
  let selectedValue: string = "";
  if (watch) {
    const values = watch();
    selectedValue = values[element.id] ?? "";
  }

  // Normalise the URL: strip leading/trailing whitespace, then ensure
  // a protocol is present so the <a> tag works correctly regardless of
  // whether the user typed "https://", "http://" or just "example.com".
  const trimmed = selectedValue.trim();
  const hasProtocol = /^https?:\/\//i.test(trimmed);
  const fullHref = trimmed
    ? hasProtocol
      ? trimmed
      : `https://${trimmed}`
    : "";

  // Label shown inside the input — hide it when the user has already typed
  // a protocol themselves so we don't show a confusing double prefix.
  const showPrefix = !hasProtocol;

  return (
    <div>
      {/* ── Editable input ── */}
      {!validationData?.isReadOnly && (
        <div className="relative">
          {showPrefix && (
            <span className="text-sm absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none select-none">
              https://
            </span>
          )}
          <input
            placeholder={element?.placeholder || "Enter Url link"}
            type="text"
            className={clsx(
              "field-control",
              showPrefix && "!pl-16",
              element?.customClass,
            )}
            {...register(element?.id)}
            disabled={validationData?.isReadOnly}
          />
        </div>
      )}

      {/* ── Link preview (shown below input when a value exists, or as the
            sole content in read-only mode) ── */}
      {trimmed ? (
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
            rel="noopener noreferrer"
            className="hover:underline text-blue-700 break-all"
            href={fullHref}
          >
            {trimmed}
          </a>
        </div>
      ) : (
        /* ── Read-only with no value: show an empty field-control placeholder ── */
        validationData?.isReadOnly && (
          <div className="field-control !bg-gray-50 mt-1 text-gray-400 text-sm">
            No link provided
          </div>
        )
      )}
    </div>
  );
}
