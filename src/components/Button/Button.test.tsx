import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Test Button" />);
    expect(screen.getByRole('button')).toHaveTextContent('Test Button');
  });

  it('applies primary styling when primary prop is true', () => {
    render(<Button label="Primary Button" primary />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--primary');
  });

  it('applies secondary styling by default', () => {
    render(<Button label="Secondary Button" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--secondary');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Button label="Button" size="small" />);
    expect(screen.getByRole('button')).toHaveClass('button--small');

    rerender(<Button label="Button" size="medium" />);
    expect(screen.getByRole('button')).toHaveClass('button--medium');

    rerender(<Button label="Button" size="large" />);
    expect(screen.getByRole('button')).toHaveClass('button--large');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom background color', () => {
    render(<Button label="Custom Button" backgroundColor="red" />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ backgroundColor: 'red' });
  });
});