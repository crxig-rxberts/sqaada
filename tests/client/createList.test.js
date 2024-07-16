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

// Mock the Card and ListForm components
jest.mock('../../client/src/Components/Card', () => ({ children }) => <div data-testid="card">{children}</div>);
jest.mock('../../client/src/Components/ListForm', () => ({ onSubmit }) => (
  <form data-testid="list-form" onSubmit={(e) => { e.preventDefault(); onSubmit('My New List'); }}>
    <input type="text" aria-label="List Name:" />
    <button type="submit">Create List</button>
  </form>
));

describe('CreateList Component', () => {
  test('renders CreateList component', () => {
    render(
      <MemoryRouter>
        <CreateList />
      </MemoryRouter>
    );
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('list-form')).toBeInTheDocument();
  });

  test('submits form with list name', async () => {
    createNewList.mockResolvedValue({ status: 'SUCCESS', listId: '123' });
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigateMock);

    render(
      <MemoryRouter>
        <CreateList />
      </MemoryRouter>
    );

    fireEvent.submit(screen.getByTestId('list-form'));

    await waitFor(() => {
      expect(createNewList).toHaveBeenCalledWith('My New List');
      expect(navigateMock).toHaveBeenCalledWith('/list/123');
    });
  });

  test('handles error when creating list', async () => {
    createNewList.mockRejectedValue(new Error('Failed to create list'));
    console.error = jest.fn(); // Mock console.error

    render(
      <MemoryRouter>
        <CreateList />
      </MemoryRouter>
    );

    fireEvent.submit(screen.getByTestId('list-form'));

    await waitFor(() => {
      expect(createNewList).toHaveBeenCalledWith('My New List');
      expect(console.error).toHaveBeenCalledWith('Error creating list:', expect.any(Error));
    });
  });
});