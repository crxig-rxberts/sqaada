import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ListDetails from '../../../client/src/Components/ListDetails';
import { getListById } from '../../../client/src/clients/toDoClient';

jest.mock('../../../client/src/clients/toDoClient');
jest.mock('../../../client/src/Components/TodoItem', () => ({ item }) => <div data-testid="todo-item">{item.name}</div>);
jest.mock('../../../client/src/Components/LoadingSpinner', () => () => <div data-testid="loading-spinner" />);

describe('ListDetails rendering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('renders loading spinner initially', () => {
    render(
      <MemoryRouter initialEntries={['/list/1']}>
        <Routes>
          <Route path="/list/:listId" element={<ListDetails />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders list details when data is loaded', async () => {
    getListById.mockResolvedValue({
      status: 'SUCCESS',
      list: {
        listId: '1',
        name: 'Test List',
        items: [
          { itemId: '1', name: 'Item 1', status: 'TODO', dueDate: '2024-07-15' },
          { itemId: '2', name: 'Item 2', status: 'COMPLETED', dueDate: '2024-07-16' },
        ],
      },
    });

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
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });
});