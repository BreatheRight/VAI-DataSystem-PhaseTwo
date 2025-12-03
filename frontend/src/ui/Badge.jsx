import React from 'react';

export function Badge({ active = false, children, className = '' }) {
  const styles = active
    ? 'bg-vai-orange text-white'
    : 'bg-vai-blueLight text-vai-black';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${styles} ${className}`}>
      {children}
    </span>
  );
}
