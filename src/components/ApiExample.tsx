import React from 'react';

const ApiExample = () => (
  <blockquote className='bg-gray-100 p-4 rounded-md text-gray-700'>
    <ul>
      <li className='text-xs'>
        API URL example format: <code>https://example.com/validation?value=&#123;value&#125;</code>
      </li>
      <li className='text-xs'>
      <span className='block mb-1'>  Response example format:</span>
        <pre className='bg-white p-2 rounded-md'>
          <code>
            &#123; <br />
            &nbsp;&nbsp;"data": &#123; <br />
            &nbsp;&nbsp;&nbsp;&nbsp;"status": true, <br />
            &nbsp;&nbsp;&nbsp;&nbsp;"description": "John Doe" <br />
            &nbsp;&nbsp;&#125; <br />
            &#125;
          </code>
        </pre>
      </li>
    </ul>
  </blockquote>
);

export default ApiExample;
