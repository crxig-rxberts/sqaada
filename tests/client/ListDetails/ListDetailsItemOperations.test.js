import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ListDetails from '../../../client/src/Components/ListDetails';
import { getListById, addItemInList, updateItemInList, deleteItemFromList, getItemFromList } from '../../../client/src/clients/toDoClient';

jest.mock('../../../client/src/clients/toDoClient');
jest.mock('../../../client/src/Components/TodoItem', () => ({ item, onStatusChange, onEdit, onDelete }) => (
  <div data-testid="todo-item">
    <span>{item.name}</span>
    <button onClick={() => onStatusChange(item.itemId, 'COMPLETED')}>Complete</button>
    <button onClick={() => onEdit(item.itemId)}>Edit</button>
    <button onClick={() => onDelete(item.itemId)}>Delete</button>
  </div>
));
jest.mock('../../../client/src/Components/TodoForm', () => ({ onSubmit }) => (
  <form data-testid="todo-form" onSubmit={onSubmit}>
    <button type="submit">Submit</button>
  </form>
));
jest.mock('../../../client/src/Components/Modal', () => ({ isOpen, children }) => (
  isOpen ? <div data-testid="modal">{children}</div> : null
));

const mockList = {
  listId: '1',
  name: 'Test List',
  items: [
    { itemId: '1', name: 'Item 1', status: 'TODO', dueDate: '2024-07-15' },
    { itemId: '2', name: 'Item 2', status: 'COMPLETED', dueDate: '2024-07-16' },
  ],
};

describe('ListDetails item operations', () => {
  beforeEach(() => {
    getListById.mockResolvedValue({ status: 'SUCCESS', list: mockList });
    addItemInList.mockResolvedValue({ status: 'SUCCESS', itemId: '3' });
    updateItemInList.mockResolvedValue({ status: 'SUCCESS' });
    deleteItemFromList.mockResolvedValue({ status: 'SUCCESS' });
    getItemFromList.mockResolvedValue({ status: 'SUCCESS', item: mockList.items[0] });
  });

  test('adds new item', async () => {
    render(
      <MemoryRouter initialEntries={['/list/1']}>
        <Routes>
          <Route path="/list/:listId" element={<ListDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Add New Item'));
    fireEvent.click(screen.getByText('Add New Item'));
    fireEvent.submit(screen.getByTestId('todo-form'));

    await waitFor(() => {
      expect(addItemInList).toHaveBeenCalled();
      expect(getListById).toHaveBeenCalledTimes(2);
    });
  });

  test('updates item status', async () => {
    render(
      <MemoryRouter initialEntries={['/list/1']}>
        <Routes>
          <Route path="/list/:listId" element={<ListDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getAllByText('Complete'));
    fireEvent.click(screen.getAllByText('Complete')[0]);

    await waitFor(() => {
      expect(updateItemInList).toHaveBeenCalled();
      expect(getListById).toHaveBeenCalledTimes(2);
    });
  });

  test('deletes item', async () => {
    render(
      <MemoryRouter initialEntries={['/list/1']}>
        <Routes>
          <Route path="/list/:listId" element={<ListDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getAllByText('Delete'));
    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => {
      expect(deleteItemFromList).toHaveBeenCalled();
      expect(getListById).toHaveBeenCalledTimes(2);
    });
  });

  test('opens edit modal', async () => {
    render(
      <MemoryRouter initialEntries={['/list/1']}>
        <Routes>
          <Route path="/list/:listId" element={<ListDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getAllByText('Edit'));
    fireEvent.click(screen.getAllByText('Edit')[0]);

    await waitFor(() => {
      expect(getItemFromList).toHaveBeenCalled();
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('todo-form')).toBeInTheDocument();
    });
  });
});