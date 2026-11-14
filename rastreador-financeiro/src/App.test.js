import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-chartjs-2', () => ({
  Bar: () => null,
  Pie: () => null,
  Doughnut: () => null,
  Line: () => null,
}));

jest.mock('./services/supabaseClient', () => {
  const consulta = {};
  consulta.select = () => consulta;
  consulta.eq = () => consulta;
  consulta.order = () => Promise.resolve({ data: [], error: null });
  consulta.maybeSingle = () => Promise.resolve({ data: null, error: null });
  consulta.insert = () => Promise.resolve({ error: null });
  return { supabase: { from: () => consulta } };
});

test('renderiza o título do aplicativo', async () => {
  render(<App />);
  expect(await screen.findByText(/rastreador de gastos/i)).toBeInTheDocument();
});