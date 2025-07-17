import React from "react";

const ValidateExample = () => (
  <blockquote className="p-4 text-gray-700 bg-gray-100 rounded-md">
    <ul>
      <li className="text-xs">
        Method: GET <br />
        URL format:{" "}
        <code>https://example.com/validation/&#123;documentId&#125;</code>
      </li>
      <li className="text-xs">
        <span className="block mb-1"> Response example format:</span>
        <pre className="p-2 bg-white rounded-md">
          <code>
            &#123; <br />
            &nbsp;&nbsp;"data": &#123; <br />
            &nbsp;&nbsp;&nbsp;&nbsp;"status": true, <br />
            &nbsp;&nbsp;&nbsp;&nbsp;"isSigned": true <br />
            &nbsp;&nbsp;&#125; <br />
            &#125;
          </code>
        </pre>
      </li>
    </ul>
  </blockquote>
);

export default ValidateExample;
