import React from "react";

export default function TextInput({
  element,
  state,
}: {
  element: string;
  state?: string;
}) {
  return (
    <div>
      <input placeholder="Type" className="input-control" />
    </div>
  );
}
