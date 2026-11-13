import { render, screen } from '@testing-library/react';
import App from './App';
jest.mock('react-chartjs-2', () => ({
  Bar: () => null,
  Pie: () => null,
  Doughnut: () => null,
  Line: () => null,
}));

test('renderiza o título do aplicativo', () => {
  render(<App />);
  expect(screen.getByText(/rastreador de gastos/i)).toBeInTheDocument();
});