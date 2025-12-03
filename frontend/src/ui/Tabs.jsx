import React from 'react';

export function Tabs({ tabs, value, onChange, className = '' }) {
  return (
    <div className={`border-b border-vai-grayLight ${className}`}>
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`
              py-2 px-1 border-b-2 font-medium text-sm transition-colors
              ${value === tab.value
                ? 'border-vai-orange text-vai-orange'
                : 'border-transparent text-vai-grayText hover:text-vai-black hover:border-vai-grayLight'
              }
            `}
            role="tab"
            aria-selected={value === tab.value}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export function TabPanel({ value, activeValue, children }) {
  if (value !== activeValue) return null;

  return (
    <div role="tabpanel" className="py-4">
      {children}
    </div>
  );
}
