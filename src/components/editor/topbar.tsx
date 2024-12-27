import  { useState } from "react";
import AppButton from "../ui/AppButton";

export default function TopBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="px-[30px] py-[10px] flex justify-between items-center">
      <div className="flex gap-x-4  items-center">
      
      
      </div>

      <div className="flex gap-x-8 items-center">
        <div className="flex gap-x-4"></div>
        <AppButton
          onClick={() => setOpen(true)}
          text="Preview"
          btnClass="text-primary border-[#98A2B3]"
        />
      
      </div>
    </div>
  );
}
