import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from '../../client/src/Components/TodoItem';

describe('TodoItem component', () => {
  const mockItem = {
    itemId: '1',
    name: 'Test Item',
    description: 'Test Description',
    status: 'TODO',
    dueDate: '2024-07-15'
  };

  const mockOnStatusChange = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  test('renders item details correctly', () => {
    render(<TodoItem item={mockItem} onStatusChange={mockOnStatusChange} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('2024-07-15')).toBeInTheDocument();
  });

  test('calls onStatusChange when status is changed', () => {
    render(<TodoItem item={mockItem} onStatusChange={mockOnStatusChange} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'COMPLETED' } });
    expect(mockOnStatusChange).toHaveBeenCalledWith('1', { status: 'COMPLETED' });
  });

  test('calls onEdit when Edit button is clicked', () => {
    render(<TodoItem item={mockItem} onStatusChange={mockOnStatusChange} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith('1');
  });

  test('calls onDelete when Delete button is clicked', () => {
    render(<TodoItem item={mockItem} onStatusChange={mockOnStatusChange} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
});