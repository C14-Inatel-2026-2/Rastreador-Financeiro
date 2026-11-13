import { render, screen } from '@testing-library/react'
import GraficoGastos from '../GraficoGastos'

jest.mock('react-chartjs-2', () => ({
  Doughnut: jest.fn(),
}))

const { Doughnut } = require('react-chartjs-2')

describe('GraficoGastos', () => {
  beforeEach(() => {
    Doughnut.mockClear()
    Doughnut.mockImplementation(() => <canvas data-testid="doughnut" />)
  })

  test('renderiza o gráfico de rosca (Doughnut mockado)', () => {
    render(<GraficoGastos dados={{ labels: [], valores: [] }} />)

    expect(screen.getByTestId('doughnut')).toBeInTheDocument()
  })

  test('repassa labels e valores para o dataset do gráfico', () => {
    const dados = { labels: ['Alimentação', 'Lazer'], valores: [50, 100] }

    render(<GraficoGastos dados={dados} />)

    const { data } = Doughnut.mock.calls[0][0]
    expect(data.labels).toEqual(['Alimentação', 'Lazer'])
    expect(data.datasets[0].data).toEqual([50, 100])
  })
})