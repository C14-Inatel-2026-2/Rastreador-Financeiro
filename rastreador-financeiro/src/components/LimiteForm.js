import { useState } from 'react'
import { supabase } from '../services/supabaseClient'

export default function LimiteForm({ onSalvo, onCancelar }) {
    const [valor, setValor] = useState('')
    const [erro, setErro] = useState('')
    const [salvando, setSalvando] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        const novoLimite = Number(String(valor).replace(',', '.'))

        if (!novoLimite || novoLimite <= 0) {
            setErro('Informe um valor maior que zero.')
            return
        }

        setSalvando(true)
        setErro('')

        const { error } = await supabase
            .from('configuracoes')
            .upsert({ id: 1, value_limit: novoLimite })

        setSalvando(false)

        if (error) {
            setErro('Erro ao salvar o limite: ' + error.message)
            return
        }

        setValor('')
        onSalvo()
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Limite de gastos</h2>
            <label>
                Novo limite (R$)
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                />
            </label>
            <div>
                <button type="submit" disabled={salvando}>
                    {salvando ? 'Salvando...' : 'Confirmar'}
                </button>
                {onCancelar && (
                    <button type="button" onClick={onCancelar}>Cancelar</button>
                )}
            </div>
            {erro && <p role="alert">{erro}</p>}
        </form>
    )
}