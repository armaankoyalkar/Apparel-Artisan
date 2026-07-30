import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('storefront', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => [] });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the storefront landing page', () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    expect(screen.getByRole('heading', { name: /wear something original/i })).toBeInTheDocument();
  });
});
