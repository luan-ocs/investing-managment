import React from 'react';

export const Card = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="w-1/2 h-1/2 min-h-[250px] rounded bg-white d-flex">
      {children}
    </div>
  );
};

export default Card;
