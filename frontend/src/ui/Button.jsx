import React from 'react';

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  children,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-vai-orange text-white hover:brightness-95 focus:ring-vai-orange',
    outline: 'border border-vai-grayLight text-vai-black hover:bg-vai-bluePale/40 focus:ring-vai-orange',
    ghost: 'text-vai-black hover:bg-vai-bluePale/40 focus:ring-vai-orange'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
