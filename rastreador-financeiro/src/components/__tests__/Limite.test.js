import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LimiteForm from '../LimiteForm'
import { supabase } from '../../services/supabaseClient'

jest.mock('../../services/supabaseClient', () => ({
  supabase: { from: jest.fn() },
}))

describe('LimiteForm', () => {
  test('renderiza o campo e os botões', () => {
    render(<LimiteForm onSalvo={() => {}} onCancelar={() => {}} />)

    expect(screen.getByLabelText(/novo limite/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  test('[negativo] mostra erro quando o valor está vazio', async () => {
    render(<LimiteForm onSalvo={() => {}} />)

    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))

    expect(screen.getByRole('alert')).toHaveTextContent('Informe um valor maior que zero.')
  })

  test('[negativo] mostra erro quando o valor é zero', async () => {
    render(<LimiteForm onSalvo={() => {}} />)

    await userEvent.type(screen.getByLabelText(/novo limite/i), '0')
    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))

    expect(screen.getByRole('alert')).toHaveTextContent('Informe um valor maior que zero.')
  })

  test('não mostra o botão Cancelar quando onCancelar não é passado', () => {
    render(<LimiteForm onSalvo={() => {}} />)

    expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument()
  })
})

describe('LimiteForm - com mock', () => {
  let onSalvo
  let mockUpsert

  beforeEach(() => {
    onSalvo = jest.fn()
    mockUpsert = jest.fn().mockResolvedValue({ error: null })
    supabase.from.mockReturnValue({ upsert: mockUpsert })
  })

  test('salva o limite no Supabase e chama onSalvo', async () => {
    render(<LimiteForm onSalvo={onSalvo} />)

    await userEvent.type(screen.getByLabelText(/novo limite/i), '500')
    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))

    await waitFor(() => expect(onSalvo).toHaveBeenCalledTimes(1))

    expect(supabase.from).toHaveBeenCalledWith('configuracoes')
    expect(mockUpsert).toHaveBeenCalledWith({ id: 1, value_limit: 500 })
  })

  test('[negativo] mostra o erro do Supabase e não chama onSalvo', async () => {
    mockUpsert.mockResolvedValue({ error: { message: 'falhou' } })
    render(<LimiteForm onSalvo={onSalvo} />)

    await userEvent.type(screen.getByLabelText(/novo limite/i), '100')
    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Erro ao salvar o limite: falhou')
    )

    expect(onSalvo).not.toHaveBeenCalled()
  })

  test('[negativo] valor inválido não chega a chamar o Supabase', async () => {
    render(<LimiteForm onSalvo={onSalvo} />)

    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))

    expect(mockUpsert).not.toHaveBeenCalled()
  })
})