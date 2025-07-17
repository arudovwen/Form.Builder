import React from "react";

const DocumentSignExample = () => (
  <blockquote className="p-4 space-y-3 text-xs text-gray-700 bg-gray-100 rounded-md">
    <ul className="space-y-1 ">
     
      <li>
        <span>Method:</span> <code>GET</code>
        <br />
        <span>Response format:</span>
        <pre className="p-2 mt-1 overflow-auto text-xs bg-white rounded-md">
          <code>
            {`{
  "data": [
    { "name": "Document Name", "id": "documentMainId", ...restObject },   
  ]
}`}
          </code>
        </pre>
      </li>
    </ul>
  </blockquote>
);

export default DocumentSignExample;
