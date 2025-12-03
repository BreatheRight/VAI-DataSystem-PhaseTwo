import React from 'react';

export function Card({ title, actions, className = '', children }) {
  return (
    <div className={`bg-white border border-vai-grayLight/30 rounded-card shadow-sm backdrop-blur-[30px] ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-vai-grayLight/30 flex items-center justify-between">
          <h3 className="font-medium text-vai-black">{title}</h3>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
