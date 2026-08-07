import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('storefront', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => new Promise(() => {}));
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('renders the storefront landing page', () => {
    render(<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></BrowserRouter>);
    expect(screen.getByRole('heading', { name: /wear something original/i })).toBeInTheDocument();
  });
});
