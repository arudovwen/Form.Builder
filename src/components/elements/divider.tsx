import clsx from "clsx";

export default function Divider({element}) {
  const staticClass = "border-gray-200 my-4";
  return (
    <div>
      <hr className={clsx(staticClass, element?.customClass)} />
    </div>
  );
}
