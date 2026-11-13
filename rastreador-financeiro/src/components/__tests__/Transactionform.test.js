import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TransactionForm from '../Transactionform'

describe('TransactionForm - sem mock', () => {
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
  })

  test('chama onAdd com a transação preenchida', () => {
    render(<TransactionForm onAdd={onAdd} />)

    userEvent.type(screen.getByLabelText(/descrição/i), '  Supermercado ')
    userEvent.type(screen.getByLabelText(/valor/i), '45.90')
    userEvent.selectOptions(screen.getByLabelText(/categoria/i), 'Lazer')
    userEvent.click(screen.getByRole('button', { name: /entrada/i }))
    userEvent.click(screen.getByRole('button', { name: /adicionar transação/i }))

    expect(onAdd).toHaveBeenCalledTimes(1)
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

  test('limpa o formulário após adicionar', () => {
    render(<TransactionForm onAdd={onAdd} />)

    userEvent.type(screen.getByLabelText(/descrição/i), 'Café')
    userEvent.type(screen.getByLabelText(/valor/i), '8')
    userEvent.click(screen.getByRole('button', { name: /adicionar transação/i }))

    expect(screen.getByLabelText(/descrição/i)).toHaveValue('')
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
  })

  test('sugere Transporte ao sair do campo com "Uber"', () => {
    render(<TransactionForm onAdd={onAdd} />)

    userEvent.type(screen.getByLabelText(/descrição/i), 'Uber')
    userEvent.tab()

    expect(screen.getByLabelText(/categoria/i)).toHaveValue('Transporte')
  })

  test('sugere Alimentação ao sair do campo com "Ifood"', () => {
    render(<TransactionForm onAdd={onAdd} />)

    userEvent.type(screen.getByLabelText(/descrição/i), 'Uber')
    userEvent.tab()
    expect(screen.getByLabelText(/categoria/i)).toHaveValue('Transporte')

    userEvent.clear(screen.getByLabelText(/descrição/i))
    userEvent.type(screen.getByLabelText(/descrição/i), 'Ifood')
    userEvent.tab()

    expect(screen.getByLabelText(/categoria/i)).toHaveValue('Alimentação')
  })

  test('a categoria escolhida manualmente é a que vale ao salvar', () => {
    render(<TransactionForm onAdd={onAdd} />)

    userEvent.type(screen.getByLabelText(/descrição/i), 'Uber')
    userEvent.tab()
    userEvent.selectOptions(screen.getByLabelText(/categoria/i), 'Lazer')

    userEvent.click(screen.getByLabelText(/descrição/i))
    userEvent.tab()

    userEvent.type(screen.getByLabelText(/valor/i), '25')
    userEvent.click(screen.getByRole('button', { name: /adicionar transação/i }))

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ categoria: 'Lazer' })
    )
  })
})