import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ListDetails from '../../../client/src/Components/ListDetails';
import { 
  getListById, 
  addItemInList, 
  updateItemInList, 
  deleteItemFromList, 
  getItemFromList 
} from '../../../client/src/clients/toDoClient';

const mockList = {
  listId: '1',
  name: 'Test List',
  items: [
    { itemId: '1', name: 'Item 1', status: 'TODO', dueDate: '2024-07-15' },
    { itemId: '2', name: 'Item 2', status: 'COMPLETED', dueDate: '2024-07-16' },
  ],
};

jest.mock('../../../client/src/clients/toDoClient');
jest.mock('../../../client/src/Components/TodoItem', () => ({ item, onStatusChange, onEdit, onDelete }) => (
  <div data-testid="todo-item">
    {item.name}
    <button onClick={() => onStatusChange(item.itemId, { ...item, status: item.status === 'TODO' ? 'COMPLETED' : 'TODO' })}>Toggle Status</button>
    <button onClick={() => onEdit(item.itemId)}>Edit</button>
    <button onClick={() => onDelete(item.itemId)}>Delete</button>
  </div>
));
jest.mock('../../../client/src/Components/TodoForm', () => ({ item, onChange, onSubmit }) => (
  <form data-testid="todo-form" onSubmit={onSubmit}>
    <input 
      value={item.name} 
      onChange={e => onChange({ ...item, name: e.target.value })}
    />
    <button type="submit">Submit</button>
  </form>
));
jest.mock('../../../client/src/Components/Modal', () => ({ isOpen, children }) => (
  isOpen ? <div data-testid="modal">{children}</div> : null
));
jest.mock('../../../client/src/Components/LoadingSpinner', () => () => <div data-testid="loading-spinner" />);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useState: jest.fn().mockReturnValue([mockList, {}]),
  useParams: () => ({ listId: '1' }),
}));

describe('ListDetails component integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getListById.mockResolvedValue({ status: 'SUCCESS', list: mockList });
    addItemInList.mockResolvedValue({ status: 'SUCCESS', itemId: '3' });
    updateItemInList.mockResolvedValue({ status: 'SUCCESS' });
    deleteItemFromList.mockResolvedValue({ status: 'SUCCESS' });
    getItemFromList.mockResolvedValue({ status: 'SUCCESS', item: mockList.items[0] });
    
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

  test('opens modal when Add New Item is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/list/1']}>
        <Routes>
          <Route path="/list/:listId" element={<ListDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('Add New Item'));
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('todo-form')).toBeInTheDocument();
    });
  });

  test('updates item status when toggled', async () => {
    render(
      <MemoryRouter initialEntries={['/list/1']}>
        <Routes>
          <Route path="/list/:listId" element={<ListDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const toggleButtons = screen.getAllByText('Toggle Status');
      fireEvent.click(toggleButtons[0]);
      expect(updateItemInList).toHaveBeenCalledWith('1', '1', expect.objectContaining({ status: 'COMPLETED' }));
    });
  });

  test('deletes item when delete button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/list/1']}>
        <Routes>
          <Route path="/list/:listId" element={<ListDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
      expect(deleteItemFromList).toHaveBeenCalledWith('1', '1');
    });
  });

  test('sorts items when sort button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/list/1']}>
        <Routes>
          <Route path="/list/:listId" element={<ListDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const sortButton = screen.getByText(/Sort by Date/);
      fireEvent.click(sortButton);
      const items = screen.getAllByTestId('todo-item');
      expect(items[0].textContent).toContain('Item 2');
      expect(items[1].textContent).toContain('Item 1');
    });
  });
});
