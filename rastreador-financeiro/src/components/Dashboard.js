import './Dashboard.css' 
import GraficoGastos from './GraficoGastos'
import Transactionform from './Transactionform'
import { useState, useEffect } from 'react'
import { agruparPorCategoria, filtrarPorPeriodo } from './utils'
import { supabase } from '../services/supabaseClient'

const MESES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export default function Dashboard(){
    const hoje = new Date()
    const anoAtual = hoje.getFullYear()
    const mesAtual = hoje.getMonth()

    const [transacoes, setTransacoes] = useState([])
    const [filtro, setFiltro] = useState('mes')
    const [mesSelecionado, setMesSelecionado] = useState(mesAtual)
    const [anoSelecionado, setAnoSelecionado] = useState(anoAtual)
    const [loading, setLoading] = useState(true)

    // Função para buscar as transações do Supabase
    async function carregarTransacoes() {
        setLoading(true)
        const { data, error } = await supabase
            .from('id') // Nome da tabela no Supabase
            .select('*')
            .order('date', { ascending: false })

        if (error) {
            console.error('Erro ao buscar transações do Supabase:', error.message)
        } else {
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

    const transacoesFiltradas = filtrarPorPeriodo(transacoes, filtro, mesSelecionado, anoSelecionado)
    const dadosGrafico = agruparPorCategoria(transacoesFiltradas)

    return (
        <>
        <div className="dashboard">
            <div className="content">
                <div>
                    <h1>Dashboard</h1>
                </div>
                <div className="filtros-container">
                    <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                        <option value="semana">Semana</option>
                        <option value="mes">Mês</option>
                        <option value="ano">Ano</option>
                    </select>

                    {filtro === 'mes' && (
                        <select value={mesSelecionado} onChange={(e) => setMesSelecionado(Number(e.target.value))}>
                            {MESES.map((mes, index) => (
                                <option key={index} value={index}>{mes}</option>
                            ))}
                        </select>
                    )}
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