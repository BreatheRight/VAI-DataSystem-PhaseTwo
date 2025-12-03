import React from 'react';

export function Select({
  label,
  id,
  options = [],
  error,
  className = '',
  ...props
}) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-vai-black mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className="
          w-full px-3 py-2 border border-vai-grayLight rounded-lg
          focus:outline-none focus:ring-2 focus:ring-vai-orange focus:border-transparent
          disabled:bg-gray-50 disabled:cursor-not-allowed
        "
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
