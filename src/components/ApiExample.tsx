import React from 'react';

const ApiExample = () => (
  <blockquote>
    <ul>
      <li className='text-13'>
        {'API URL example format: https://example.com/validation/{value}'}
      </li>
      <li className='text-13'>
        Response example format:
        <pre className='bg-white p-2 rounded-md'>
          <code>
            <span >{'{'} </span> <br/>
            <span>{' "data":{'}</span> <br/>
            <span>{'  "status": true,'}</span> <br/>
            <span>{'  "description": JOHN DOE,'}</span> <br/>
            <span>{'  }'}</span><br/>
            <span>{' }'}</span>
          </code>
        </pre>
      </li>
    </ul>
  </blockquote>
);

export default ApiExample;
