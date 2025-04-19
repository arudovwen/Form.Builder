import clsx from "clsx";

export default function Spacer({element}) {
  const staticClass = "py-6";

  return <div className={clsx(staticClass, element?.customClass)} />;
}
