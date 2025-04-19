export default function BasicText({
  element,
  state,
}: {
  element: any;
  state?: string;
}) {

  return (
    <>
      <div className={element?.customClass}>
        {element?.value || (state === 'edit' && <span className="text-gray-400">Provide text</span>)}
      </div>
    </>
  );
}
