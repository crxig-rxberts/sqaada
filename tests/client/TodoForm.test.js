import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoForm from '../../client/src/Components/TodoForm';

describe('TodoForm component', () => {
  const mockItem = {
    itemId: '',
    name: '',
    description: '',
    dueDate: '',
    status: 'TODO'
  };

  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn(e => e.preventDefault());

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnSubmit.mockClear();
  });

  test('renders form fields correctly', () => {
    render(<TodoForm item={mockItem} onChange={mockOnChange} onSubmit={mockOnSubmit} />);
    
    expect(screen.getByPlaceholderText('Item Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument();
  });

  test('calls onChange when input values change', () => {
    render(<TodoForm item={mockItem} onChange={mockOnChange} onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByPlaceholderText('Item Name'), { target: { value: 'New Item' } });
    expect(mockOnChange).toHaveBeenCalledWith({ ...mockItem, name: 'New Item' });

    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'New Description' } });
    expect(mockOnChange).toHaveBeenCalledWith({ ...mockItem, description: 'New Description' });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'FLAGGED' } });
    expect(mockOnChange).toHaveBeenCalledWith({ ...mockItem, status: 'FLAGGED' });
  });

  test('calls onSubmit when form is submitted', () => {
    const { container } = render(<TodoForm item={mockItem} onChange={mockOnChange} onSubmit={mockOnSubmit} />);

    const form = container.querySelector('form');
    fireEvent.submit(form);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  test('disables status select when item is completed', () => {
    const completedItem = { ...mockItem, status: 'COMPLETED' };
    render(<TodoForm item={completedItem} onChange={mockOnChange} onSubmit={mockOnSubmit} />);
    
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  test('displays "Save Changes" button for existing items', () => {
    const existingItem = { ...mockItem, itemId: '1' };
    render(<TodoForm item={existingItem} onChange={mockOnChange} onSubmit={mockOnSubmit} />);
    
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
  });
});