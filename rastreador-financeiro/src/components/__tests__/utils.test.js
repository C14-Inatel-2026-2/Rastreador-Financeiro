import { obterIntervalo, filtrarPorPeriodo, agruparPorCategoria, formatarReais, calcularTotalGasto, listarAnos, sugerirCategoria } from '../utils'
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

describe('obterIntervalo', () => {
  const agora = new Date(2026, 10, 14, 12)

  afterEach(() => {
    jest.useRealTimers()
  })

  test('semana começa 6 dias atrás e termina no fim de hoje', () => {
    const { inicio, fim } = obterIntervalo('semana', agora)

    expect(inicio).toEqual(new Date(2026, 10, 8))
    expect(fim).toEqual(new Date(2026, 10, 14, 23, 59, 59, 999))
  })

  test('mês sem escolha começa 1 mês atrás', () => {
    const { inicio, fim } = obterIntervalo('mes', agora)

    expect(inicio).toEqual(new Date(2026, 9, 14))
    expect(fim).toEqual(new Date(2026, 10, 14, 23, 59, 59, 999))
  })

  test('mês escolhido no passado vai do dia 1 ao último dia do mês', () => {
    const { inicio, fim } = obterIntervalo('mes', agora, { ano: 2026, mes: 9 })

    expect(inicio).toEqual(new Date(2026, 9, 1))
    expect(fim).toEqual(new Date(2026, 9, 31, 23, 59, 59, 999))
  })

  test('mês escolhido igual ao atual não inclui dias futuros', () => {
    const { fim } = obterIntervalo('mes', agora, { ano: 2026, mes: 10 })

    expect(fim).toEqual(new Date(2026, 10, 14, 23, 59, 59, 999))
  })

  test('ano escolhido vai de 1º de janeiro a 31 de dezembro', () => {
    const { inicio, fim } = obterIntervalo('ano', agora, { ano: 2025, mes: 0 })

    expect(inicio).toEqual(new Date(2025, 0, 1))
    expect(fim).toEqual(new Date(2025, 11, 31, 23, 59, 59, 999))
  })

  test('ano sem escolha começa 12 meses atrás', () => {
    const { inicio } = obterIntervalo('ano', agora)

    expect(inicio).toEqual(new Date(2025, 10, 14))
  })

  test('[negativo] no dia 31 o mês anterior mais curto não passa do último dia', () => {
    const { inicio } = obterIntervalo('mes', new Date(2026, 2, 31))

    expect(inicio).toEqual(new Date(2026, 1, 28))
  })

  test('[negativo] retorna null quando o filtro é desconhecido', () => {
    expect(obterIntervalo('todos', agora)).toBeNull()
  })

  test('[mock] usa a data do sistema quando agora não é informado', () => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(agora)

    const { inicio, fim } = obterIntervalo('semana')

    expect(inicio).toEqual(new Date(2026, 10, 8))
    expect(fim).toEqual(new Date(2026, 10, 14, 23, 59, 59, 999))
  })
})

describe('filtrarPorPeriodo', () => {
  const agora = new Date(2026, 10, 14, 12)

  afterEach(() => {
    jest.useRealTimers()
  })

  test('semana inclui os últimos 7 dias e exclui antes e depois', () => {
    const transacoes = [
      { id: 1, data: '2026-11-07' },
      { id: 2, data: '2026-11-08' },
      { id: 3, data: '2026-11-14' },
      { id: 4, data: '2026-11-15' },
    ]

    const ids = filtrarPorPeriodo(transacoes, 'semana', agora).map((t) => t.id)

    expect(ids).toEqual([2, 3])
  })

  test('mês escolhido traz só as transações daquele mês', () => {
    const transacoes = [
      { id: 1, data: '2026-09-30' },
      { id: 2, data: '2026-10-01' },
      { id: 3, data: '2026-10-31' },
      { id: 4, data: '2026-11-01' },
    ]

    const ids = filtrarPorPeriodo(transacoes, 'mes', agora, { ano: 2026, mes: 9 }).map((t) => t.id)

    expect(ids).toEqual([2, 3])
  })

  test('ano escolhido traz só as transações daquele ano', () => {
    const transacoes = [
      { id: 1, data: '2024-12-31' },
      { id: 2, data: '2025-01-01' },
      { id: 3, data: '2025-12-31' },
      { id: 4, data: '2026-01-01' },
    ]

    const ids = filtrarPorPeriodo(transacoes, 'ano', agora, { ano: 2025, mes: 0 }).map((t) => t.id)

    expect(ids).toEqual([2, 3])
  })

  test('aceita a data como objeto Date', () => {
    const transacoes = [{ id: 1, data: new Date(2026, 10, 10) }]

    expect(filtrarPorPeriodo(transacoes, 'semana', agora)).toHaveLength(1)
  })

  test('[negativo] devolve todas as transações quando o filtro é desconhecido', () => {
    const transacoes = [{ id: 1, data: '2020-01-01' }]

    expect(filtrarPorPeriodo(transacoes, 'todos', agora)).toEqual(transacoes)
  })

  test('[negativo] devolve lista vazia quando não há transações', () => {
    expect(filtrarPorPeriodo([], 'semana', agora)).toEqual([])
  })

  test('[mock] usa a data do sistema quando agora não é informado', () => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(agora)
    const transacoes = [
      { id: 1, data: '2026-11-07' },
      { id: 2, data: '2026-11-10' },
      { id: 3, data: '2026-11-15' },
    ]

    const ids = filtrarPorPeriodo(transacoes, 'semana').map((t) => t.id)

    expect(ids).toEqual([2])
  })
})