import React from 'react';

const OptionsExample = () => (
  <blockquote className="bg-gray-100 p-4 rounded-md text-gray-700 text-sm space-y-3">
    <ul className="list-disc list-inside space-y-1">
      <li>
        <strong>Method:</strong> <code>GET</code>
      </li>
      <li>
        <strong>Response format:</strong>
        <pre className="bg-white p-2 mt-1 rounded-md overflow-auto text-xs">
          <code>
{`{
  "data": [
    { "label": "Option 1", "value": "1" },
    { "label": "Option 2", "value": "2" }
  ]
}`}
          </code>
        </pre>
      </li>
    </ul>
  </blockquote>
);

export default OptionsExample;
