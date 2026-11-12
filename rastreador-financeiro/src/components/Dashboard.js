import './Dashboard.css' 
import GraficoGastos from './GraficoGastos'
import Transactionform from './Transactionform'
import { useState, useEffect } from 'react'
import { agruparPorCategoria, filtrarPorPeriodo } from './utils'
import { supabase } from '../services/supabaseClient'

export default function Dashboard(){
    const [transacoes, setTransacoes] = useState([])
    const [filtro, setFiltro] = useState('mes')
    const [loading, setLoading] = useState(true)

    async function carregarTransacoes() {
        setLoading(true)
        const { data, error } = await supabase
            .from('id') // Nome da tabela no Supabase
            .select('*')
            .order('date', { ascending: false })

        if (error) {
            console.error('Erro ao buscar transações do Supabase:', error.message)
        } else {
            // Mapeia os dados do banco para garantir compatibilidade com o app
            const dadosFormatados = (data || []).map(t => ({
                id: t.id,
                descricao: t.description || t.descricao || 'Sem descrição',
                valor: Number(t.value || t.valor || 0),
                tipo: t.type || t.tipo || 'saida',
                categoria: t.category || t.categoria || 'Outros',
                data: t.date
            }))
            setTransacoes(dadosFormatados)
        }
        setLoading(false)
    }

    useEffect(() => {
        carregarTransacoes()
    }, [])

    function handleAdd(novaTransacao) {
        setTransacoes((atuais) => [novaTransacao, ...atuais])
        carregarTransacoes() // Recarrega do banco para garantir sincronia
    }

    const transacoesFiltradas = filtrarPorPeriodo(transacoes, filtro)
    const dadosGrafico = agruparPorCategoria(transacoesFiltradas)

    return (
        <>
        <div className="dashboard">
            <div className="content">
                <div>
                    <h1>Dashboard</h1>
                </div>
                <div>
                    <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                        <option value="semana">Semana</option>
                        <option value="mes">Mês</option>
                        <option value="ano">Ano</option>
                    </select>
                </div>
            </div>
            
            <div className="grafico">
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>Carregando dados...</p>
                ) : (
                    <GraficoGastos dados={dadosGrafico}/>
                )}
            </div>
        </div>
        <Transactionform onAdd={handleAdd} />
        </>
    )
}