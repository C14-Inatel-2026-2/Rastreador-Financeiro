import { filtrarPorPeriodo, agruparPorCategoria, formatarReais, calcularTotalGasto, listarAnos, sugerirCategoria } from '../utils'

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

  describe('sugerirCategoria', () => {
  test('reconhece palavra-chave ignorando maiúsculas e acentos', () => {
    expect(sugerirCategoria('Ônibus')).toBe('Transporte')
    expect(sugerirCategoria('Ifood')).toBe('Alimentação')
    expect(sugerirCategoria('Salário')).toBe('Salário')
  })

  test('[negativo] retorna null quando nada combina', () => {
    expect(sugerirCategoria('Cinema')).toBeNull()
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

describe('formatarReais', () => {
    test('formata o valor em reais', () => {
        expect(formatarReais(1500.5).replace(/\u00a0/g, ' ')).toBe('R$ 1.500,50')
    })
})

describe('calcularTotalGasto', () => {
    test('soma só as saídas', () => {
        const transacoes = [
            { tipo: 'saida', valor: 100 },
            { tipo: 'saida', valor: 50 },
            { tipo: 'entrada', valor: 1000 },
        ]
        expect(calcularTotalGasto(transacoes)).toBe(150)
    })
})

describe('listarAnos', () => {
    test('inclui o ano atual, sem repetir, do maior para o menor', () => {
        const transacoes = [
            { data: '2024-03-10' },
            { data: '2025-01-05' },
            { data: '2024-12-31' },
        ]
        expect(listarAnos(transacoes, 2026)).toEqual([2026, 2025, 2024])
    })
})