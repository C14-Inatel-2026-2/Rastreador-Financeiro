import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TransactionForm from '../Transactionform'
import { supabase } from '../../services/supabaseClient'

jest.mock('../../services/supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

describe('TransactionForm - sem mock', () => {
  beforeEach(() => {
    supabase.from.mockReturnValue({
      insert: jest.fn(() => ({
        select: jest.fn().mockResolvedValue({ data: [{}], error: null }),
      })),
    })
  })

  test('renderiza os campos e o botão de envio', () => {
    render(<TransactionForm onAdd={() => {}} />)

    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/valor/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/categoria/i)).toHaveValue('Alimentação')
    expect(
      screen.getByRole('button', { name: /adicionar transação/i })
    ).toBeInTheDocument()
  })

  test('[negativo] exibe erro quando a descrição está vazia', () => {
    render(<TransactionForm onAdd={() => {}} />)

    userEvent.type(screen.getByLabelText(/valor/i), '10')
    userEvent.click(screen.getByRole('button', { name: /adicionar transação/i }))

    expect(screen.getByText('Informe uma descrição.')).toBeInTheDocument()
  })
})

describe('TransactionForm - com mock', () => {
  let onAdd

  beforeEach(() => {
    onAdd = jest.fn()
    Object.defineProperty(global, 'crypto', {
      value: { randomUUID: jest.fn(() => 'uuid-fixo') },
      configurable: true,
    })

    supabase.from.mockReturnValue({
      insert: jest.fn((dados) => ({
        select: jest.fn().mockResolvedValue({
          data: [{ id: 'uuid-fixo', ...dados[0] }],
          error: null,
        }),
      })),
    })
  })

  test('chama onAdd com a transação preenchida', async () => {
    render(<TransactionForm onAdd={onAdd} />)

    await userEvent.type(screen.getByLabelText(/descrição/i), 'Supermercado')
    await userEvent.type(screen.getByLabelText(/valor/i), '45.90')
    await userEvent.selectOptions(screen.getByLabelText(/categoria/i), 'Lazer')
    await userEvent.click(screen.getByRole('button', { name: /entrada/i }))
    await userEvent.click(screen.getByRole('button', { name: /adicionar transação/i }))

    await waitFor(() => expect(onAdd).toHaveBeenCalledTimes(1))

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'uuid-fixo',
        descricao: 'Supermercado',
        valor: 45.9,
        tipo: 'entrada',
        categoria: 'Lazer',
      })
    )
  })

  test('limpa o formulário após adicionar', async () => {
    render(<TransactionForm onAdd={onAdd} />)

    await userEvent.type(screen.getByLabelText(/descrição/i), 'Café')
    await userEvent.type(screen.getByLabelText(/valor/i), '8')
    await userEvent.click(screen.getByRole('button', { name: /adicionar transação/i }))

    await waitFor(() =>
      expect(screen.getByLabelText(/descrição/i)).toHaveValue('')
    )

    expect(screen.getByLabelText(/valor/i)).toHaveValue(null)
  })
})

describe('TransactionForm - sugestão de categoria', () => {
  let onAdd

  beforeEach(() => {
    onAdd = jest.fn()
    Object.defineProperty(global, 'crypto', {
      value: { randomUUID: jest.fn(() => 'uuid-fixo') },
      configurable: true,
    })

    supabase.from.mockReturnValue({
      insert: jest.fn((dados) => ({
        select: jest.fn().mockResolvedValue({
          data: [{ id: 'uuid-fixo', ...dados[0] }],
          error: null,
        }),
      })),
    })
  })

  test('sugere Transporte ao sair do campo com "Uber"', async () => {
    render(<TransactionForm onAdd={onAdd} />)

    await userEvent.type(screen.getByLabelText(/descrição/i), 'Uber')
    await userEvent.tab()

    expect(screen.getByLabelText(/categoria/i)).toHaveValue('Transporte')
  })

  test('sugere Alimentação ao sair do campo com "Ifood"', async () => {
    render(<TransactionForm onAdd={onAdd} />)
    const descricao = screen.getByLabelText(/descrição/i)
    await userEvent.type(descricao, 'Uber')
    await userEvent.tab()
    expect(screen.getByLabelText(/categoria/i)).toHaveValue('Transporte')

    await userEvent.clear(descricao)
    await userEvent.type(descricao, 'Ifood')
    await userEvent.tab()

    expect(screen.getByLabelText(/categoria/i)).toHaveValue('Alimentação')
  })

  test('a categoria escolhida manualmente é a que vale ao salvar', async () => {
    render(<TransactionForm onAdd={onAdd} />)

    await userEvent.type(screen.getByLabelText(/descrição/i), 'Uber')
    await userEvent.tab()
    await userEvent.selectOptions(screen.getByLabelText(/categoria/i), 'Lazer')

    await userEvent.type(screen.getByLabelText(/valor/i), '25')
    await userEvent.click(screen.getByRole('button', { name: /adicionar transação/i }))

    await waitFor(() =>
      expect(onAdd).toHaveBeenCalledWith(
        expect.objectContaining({ categoria: 'Lazer' })
      )
    )
  })
})

describe('TransactionForm - edição de transação', () => {
  let onAdd
  let onCancelarEdicao
  let mockUpdate
  let mockEq

  const transacaoMock = {
    id: 123,
    descricao: 'Conta de Internet',
    valor: 120.5,
    tipo: 'saida',
    categoria: 'Moradia',
    data: '2026-11-10',
  }

  beforeEach(() => {
    onAdd = jest.fn()
    onCancelarEdicao = jest.fn()

    mockEq = jest.fn(() => ({
      select: jest.fn().mockResolvedValue({
        data: [
          {
            id: 123,
            description: 'Internet Fibra',
            value: 150,
            type: 'saida',
            category: 'Moradia',
            date: '2026-11-10',
          },
        ],
        error: null,
      }),
    }))

    mockUpdate = jest.fn(() => ({ eq: mockEq }))

    supabase.from.mockReturnValue({
      update: mockUpdate,
    })
  })

  test('preenche os campos com os dados da transação ao entrar em modo edição', () => {
    render(
      <TransactionForm
        onAdd={onAdd}
        transacaoEditando={transacaoMock}
        onCancelarEdicao={onCancelarEdicao}
      />
    )

    expect(screen.getByText('Editar transação')).toBeInTheDocument()
    expect(screen.getByLabelText(/descrição/i)).toHaveValue('Conta de Internet')
    expect(screen.getByLabelText(/valor/i)).toHaveValue(120.5)
    expect(screen.getByLabelText(/categoria/i)).toHaveValue('Moradia')
    expect(screen.getByLabelText(/data/i)).toHaveValue('2026-11-10')
    expect(
      screen.getByRole('button', { name: /salvar alterações/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /cancelar edição/i })
    ).toBeInTheDocument()
  })

  test('atualiza a transação no Supabase e chama onAdd e onCancelarEdicao ao salvar', async () => {
    render(
      <TransactionForm
        onAdd={onAdd}
        transacaoEditando={transacaoMock}
        onCancelarEdicao={onCancelarEdicao}
      />
    )

    const inputDescricao = screen.getByLabelText(/descrição/i)
    const inputValor = screen.getByLabelText(/valor/i)

    await userEvent.clear(inputDescricao)
    await userEvent.type(inputDescricao, 'Internet Fibra')

    await userEvent.clear(inputValor)
    await userEvent.type(inputValor, '150')

    await userEvent.click(screen.getByRole('button', { name: /salvar alterações/i }))

    await waitFor(() => expect(onCancelarEdicao).toHaveBeenCalledTimes(1))

    expect(supabase.from).toHaveBeenCalledWith('id')
    expect(mockUpdate).toHaveBeenCalledWith({
      date: '2026-11-10',
      value: 150,
      type: 'saida',
      category: 'Moradia',
      description: 'Internet Fibra',
    })
    expect(mockEq).toHaveBeenCalledWith('id', 123)
    expect(onAdd).toHaveBeenCalledTimes(1)
  })

  test('limpa o formulário e chama onCancelarEdicao ao clicar em Cancelar edição', async () => {
    render(
      <TransactionForm
        onAdd={onAdd}
        transacaoEditando={transacaoMock}
        onCancelarEdicao={onCancelarEdicao}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: /cancelar edição/i }))

    expect(onCancelarEdicao).toHaveBeenCalledTimes(1)
    expect(screen.getByLabelText(/descrição/i)).toHaveValue('')
    expect(screen.getByLabelText(/valor/i)).toHaveValue(null)
  })
})