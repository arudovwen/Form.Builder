import React, { useEffect, useState } from "react";
import FormViewer from ".";
import { useParams } from "react-router-dom";

export default function MainPage() {
  const { id } = useParams();

  return (
    <div className="bg-white p-4 border border-[#E4E7EC] rounded-lg h-full overflow-y-auto">
     
      <FormViewer />
    </div>
  );
}
