import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders zavolej button', () => {
  render(<App />);
  const linkElement = screen.getByText(/Zavolej/i);
  expect(linkElement).toBeInTheDocument();
});
