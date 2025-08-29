import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  label: string;
}

export const Button: React.FC<ButtonProps> = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  className,
  ...props
}) => {
  const mode = primary ? 'button--primary' : 'button--secondary';
  const classes = ['button', `button--${size}`, mode, className].filter(Boolean).join(' ');
  
  return (
    <button
      type="button"
      className={classes}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};