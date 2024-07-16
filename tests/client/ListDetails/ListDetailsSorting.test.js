import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ListDetails from '../../../client/src/Components/ListDetails';
import { getListById } from '../../../client/src/clients/toDoClient';

jest.mock('../../../client/src/clients/toDoClient');
jest.mock('../../../client/src/Components/TodoItem', () => ({ item }) => <div data-testid="todo-item">{item.name}</div>);

const mockList = {
  listId: '1',
  name: 'Test List',
  items: [
    { itemId: '1', name: 'Item 1', status: 'TODO', dueDate: '2024-07-15' },
    { itemId: '2', name: 'Item 2', status: 'COMPLETED', dueDate: '2024-07-14' },
  ],
};

describe('ListDetails sorting', () => {
  beforeEach(() => {
    getListById.mockResolvedValue({ status: 'SUCCESS', list: mockList });
  });

  test('toggles sort order when Sort by Date is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/list/1']}>
        <Routes>
          <Route path="/list/:listId" element={<ListDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/Sort by Date/));
    const sortButton = screen.getByText(/Sort by Date/);

    expect(sortButton).toHaveTextContent('Sort by Date ↑');
    fireEvent.click(sortButton);
    expect(sortButton).toHaveTextContent('Sort by Date ↓');

    const items = screen.getAllByTestId('todo-item');
    expect(items[0]).toHaveTextContent('Item 1');
    expect(items[1]).toHaveTextContent('Item 2');
  });
});