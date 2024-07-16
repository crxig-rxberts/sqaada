import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ListDetails from '../../../client/src/Components/ListDetails';
import { getListById } from '../../../client/src/clients/toDoClient';

jest.mock('../../../client/src/clients/toDoClient');
jest.mock('../../../client/src/Components/TodoItem', () => ({ item }) => <div data-testid="todo-item">{item.name}</div>);
jest.mock('../../../client/src/Components/TodoForm', () => () => <div data-testid="todo-form" />);
jest.mock('../../../client/src/Components/Modal', () => ({ children }) => <div data-testid="modal">{children}</div>);
jest.mock('../../../client/src/Components/LoadingSpinner', () => () => <div data-testid="loading-spinner" />);

const mockList = {
  listId: '1',
  name: 'Test List',
  items: [
    { itemId: '1', name: 'Item 1', status: 'TODO', dueDate: '2024-07-15' },
    { itemId: '2', name: 'Item 2', status: 'COMPLETED', dueDate: '2024-07-16' },
  ],
};

describe('ListDetails component integration', () => {
  beforeEach(() => {
    getListById.mockResolvedValue({ status: 'SUCCESS', list: mockList });
  });

  test('renders full list details with all components', async () => {
    render(
      <MemoryRouter initialEntries={['/list/1']}>
        <Routes>
          <Route path="/list/:listId" element={<ListDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test List')).toBeInTheDocument();
      expect(screen.getAllByTestId('todo-item')).toHaveLength(2);
      expect(screen.getByText('Add New Item')).toBeInTheDocument();
      expect(screen.getByText(/Sort by Date/)).toBeInTheDocument();
    });
  });
});