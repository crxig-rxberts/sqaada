import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  MemoryRouter: ({ children }) => <div>{children}</div>,
}));
jest.mock('../../client/src/Components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('../../client/src/routes/routes', () => [
  { path: '/', component: () => <div>Home Page</div> },
  { path: '/create-list', component: () => <div>Create List Page</div> },
]);

test('renders Navbar', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByTestId('navbar')).toBeInTheDocument();
});

test('renders Home page on default route', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText('Home Page')).toBeInTheDocument();
});

test('renders Create List page on /create-list route', () => {
  render(
    <MemoryRouter initialEntries={['/create-list']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText('Create List Page')).toBeInTheDocument();
});