import React, { useMemo } from 'react';

interface GridInputProps {
  element: {
    grid: number;
  };
}

const GridInput = ({ element }: GridInputProps) => {
  const gridItems = useMemo(() => Array.from({ length: element.grid }, (_, i) => i), [element.grid]);
  
  return (
    <div 
      className="grid p-3"
      style={{
        gridTemplateColumns: `repeat(${element.grid}, 1fr)`,
        gap: '8px'
      }}
    >
      {gridItems.map((index) => (
        <div 
          key={index}
          className="border rounded p-4 min-h-[80px] transition-colors hover:border-gray-400"
        >{index}</div>
      ))}
    </div>
  );
};

export default React.memo(GridInput);