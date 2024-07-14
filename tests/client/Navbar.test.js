import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../client/src/Components/Navbar';

describe('Navbar component', () => {
  test('renders navbar with correct links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('ToDo App')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Create New List')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  test('links have correct href attributes', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('ToDo App').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Create New List').closest('a')).toHaveAttribute('href', '/create-list');
    expect(screen.getByText('Privacy Policy').closest('a')).toHaveAttribute('href', '/privacyandpolicies');
  });
});