import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../client/src/App';

jest.mock('../../client/src/Components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('../../client/src/Components/Home', () => () => <div data-testid="home">Home Page</div>);
jest.mock('../../client/src/Components/CreateList', () => () => <div data-testid="create-list">Create List Page</div>);
jest.mock('../../client/src/Components/ListDetails', () => () => <div data-testid="list-details">List Details Page</div>);
jest.mock('../../client/src/Components/PrivacyPolicy', () => () => <div data-testid="privacy-policy">Privacy Policy Page</div>);

// Mock the BrowserRouter in the App component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));

// Helper function to render the App with a specific route
const renderWithRouter = (route) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
};

describe('App routing', () => {
  test('renders Navbar on all routes', () => {
    renderWithRouter('/');
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('renders Home page on default route', () => {
    renderWithRouter('/');
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  test('renders Create List page on /create-list route', () => {
    renderWithRouter('/create-list');
    expect(screen.getByTestId('create-list')).toBeInTheDocument();
  });

  test('renders List Details page on /list/:listId route', () => {
    renderWithRouter('/list/123');
    expect(screen.getByTestId('list-details')).toBeInTheDocument();
  });

  test('renders Privacy Policy page on /privacyandpolicies route', () => {
    renderWithRouter('/privacyandpolicies');
    expect(screen.getByTestId('privacy-policy')).toBeInTheDocument();
  });
});
