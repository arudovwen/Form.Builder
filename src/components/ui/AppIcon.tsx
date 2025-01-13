import { Icon, IconifyIcon } from "@iconify/react";

export default function AppIcon({
  icon,
  iconClass,
}: {
  icon: string | IconifyIcon;
  iconClass?: string;
}) {
  return (
    <>
      <Icon icon={icon} className={iconClass} />
    </>
  );
}
