import React from 'react';

export function Input({
  label,
  id,
  error,
  className = '',
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-vai-black mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className="
          w-full px-3 py-2 border border-vai-grayLight rounded-lg
          focus:outline-none focus:ring-2 focus:ring-vai-orange focus:border-transparent
          disabled:bg-gray-50 disabled:cursor-not-allowed
        "
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
