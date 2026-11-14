import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

jest.mock('react-chartjs-2', () => ({
  Bar: () => null,
  Pie: () => null,
  Doughnut: () => null,
  Line: () => null,
}));

let mockTransacoes = [];
let mockLimite = null;

jest.mock('../../services/supabaseClient', () => ({
  supabase: {
    from: (tabela) => {
      const consulta = {};
      consulta.select = () => consulta;
      consulta.eq = () => consulta;
      consulta.insert = () => Promise.resolve({ error: null });
      consulta.order = () => Promise.resolve({ data: mockTransacoes, error: null });
      consulta.maybeSingle = () =>
        Promise.resolve({
          data: tabela === 'configuracoes' && mockLimite !== null ? { value_limit: mockLimite } : null,
          error: null,
        });
      return consulta;
    },
  },
}));

const hoje = new Date();
const dataHoje = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

const gasto = (valor) => ({
  id: 1, date: dataHoje, value: valor, type: 'saida', category: 'Lazer', description: 'Cinema',
});

beforeEach(() => {
  mockTransacoes = [];
  mockLimite = null;
});

test('RF08: mostra alerta quando o gasto passa do limite', async () => {
  mockTransacoes = [gasto(500)];
  mockLimite = 100;
  render(<Dashboard />);
  expect(await screen.findByRole('alert')).toHaveTextContent(/limite de gastos ultrapassado/i);
});

test('RF08: não mostra alerta quando o gasto está dentro do limite', async () => {
  mockTransacoes = [gasto(50)];
  mockLimite = 100;
  render(<Dashboard />);
  expect(await screen.findByText('Cinema')).toBeInTheDocument();
  expect(screen.queryByText(/limite de gastos ultrapassado/i)).not.toBeInTheDocument();
});

test('sem limite definido, mostra "Definir limite" e não alerta', async () => {
  mockTransacoes = [gasto(500)];
  render(<Dashboard />);
  expect(await screen.findByText('Cinema')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /definir limite/i })).toBeInTheDocument();
  expect(screen.queryByText(/limite de gastos ultrapassado/i)).not.toBeInTheDocument();
});