import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { store } from './data/store.js';
import { ORG_NAME } from './data/seed.js';

function renderApp(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe('Dashboard smoke render', () => {
  beforeEach(() => store.reset());

  it('renders the organisation header and headline stat tiles', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(
      screen.getByText(new RegExp(`${ORG_NAME} Performance Dashboard`))
    ).toBeInTheDocument();
    expect(screen.getByText('Avg Attainment')).toBeInTheDocument();
    expect(screen.getByText('Total Goals')).toBeInTheDocument();
  });
});

describe('role-gated routing', () => {
  beforeEach(() => store.reset());

  it('shows Admin Settings to an admin at /admin-settings', () => {
    store.setRole('admin');
    renderApp('/admin-settings');
    expect(
      screen.getByRole('heading', { name: 'Admin Settings' })
    ).toBeInTheDocument();
  });

  it('redirects a manager away from /admin-settings to the dashboard', () => {
    store.setRole('manager');
    renderApp('/admin-settings');
    expect(
      screen.queryByRole('heading', { name: 'Admin Settings' })
    ).not.toBeInTheDocument();
    // landed on the dashboard instead
    expect(
      screen.getByText(new RegExp(`${ORG_NAME} Performance Dashboard`))
    ).toBeInTheDocument();
  });

  it('hides the Admin Settings nav link for a manager', () => {
    store.setRole('manager');
    renderApp('/');
    expect(screen.queryByRole('link', { name: /Admin Settings/ })).toBeNull();
  });
});
