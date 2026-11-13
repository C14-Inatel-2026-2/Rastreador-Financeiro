import { agruparPorCategoria } from '../utils'

describe('agruparPorCategoria', () => {
  test('soma os valores de saídas da mesma categoria', () => {
    const transacoes = [
      { tipo: 'saida', categoria: 'Alimentação', valor: 30 },
      { tipo: 'saida', categoria: 'Alimentação', valor: 20.5 },
      { tipo: 'saida', categoria: 'Lazer', valor: 100 },
    ]

    expect(agruparPorCategoria(transacoes)).toEqual({
      labels: ['Alimentação', 'Lazer'],
      valores: [50.5, 100],
    })
  })

  test('[negativo] ignora transações do tipo entrada', () => {
    const transacoes = [
      { tipo: 'entrada', categoria: 'Salário', valor: 3000 },
      { tipo: 'saida', categoria: 'Transporte', valor: 15 },
    ]

    const resultado = agruparPorCategoria(transacoes)

    expect(resultado.labels).toEqual(['Transporte'])
    expect(resultado.valores).toEqual([15])
  })
})