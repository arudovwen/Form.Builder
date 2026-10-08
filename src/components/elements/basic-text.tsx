export default function BasicText({
  element,
  state,
  validationData,
}: {
  element: any;
  state?: string;
  validationData?: any;
}) {
  const { watch } = validationData || {};
  const isFieldSource = element.valueSource === "field" && element.sourceFieldId;
  const sourceValue = isFieldSource && typeof watch === 'function' ? watch(element.sourceFieldId) : undefined;


  return (
    <>
      <div className={element?.customClass}>
        {isFieldSource ? (
          sourceValue || (state === 'edit' && <span className="text-gray-400">Empty dynamic text</span>)
        ) : (
          element?.value || (state === 'edit' && <span className="text-gray-400">Provide text</span>)
        )}
      </div>
    </>
  );
}
