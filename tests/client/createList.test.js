import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateList from '../../client/src/Components/CreateList';
import { createNewList } from '../../clients/toDoClient';

jest.mock('../../clients/toDoClient');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

test('renders CreateList component', () => {
  render(
    <MemoryRouter>
      <CreateList />
    </MemoryRouter>
  );
  expect(screen.getByText('Create New ToDo List')).toBeInTheDocument();
});

test('submits form with list name', async () => {
  createNewList.mockResolvedValue({ status: 'SUCCESS', listId: '123' });
  
  render(
    <MemoryRouter>
      <CreateList />
    </MemoryRouter>
  );
  
  fireEvent.change(screen.getByLabelText('List Name:'), { target: { value: 'My New List' } });
  fireEvent.click(screen.getByText('Create List'));
  
  await waitFor(() => {
    expect(createNewList).toHaveBeenCalledWith('My New List');
  });
});