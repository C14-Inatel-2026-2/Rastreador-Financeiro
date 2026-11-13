import './Dashboard.css'
import GraficoGastos from './GraficoGastos'
import Transactionform from './Transactionform'
import LimiteForm from './/LimiteForm'
import { useState, useEffect } from 'react'
import { agruparPorCategoria, filtrarPorPeriodo } from './utils'
import { supabase } from '../services/supabaseClient'

const MESES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const TABELA = 'id'

function formatarReais(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function normalizarTipo(tipo) {
    const t = String(tipo || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
    return t.startsWith('en') ? 'entrada' : 'saida'
}

export default function Dashboard() {
    const hoje = new Date()
    const anoAtual = hoje.getFullYear()
    const mesAtual = hoje.getMonth()

    const [transacoes, setTransacoes] = useState([])
    const [filtro, setFiltro] = useState('mes')
    const [mesSelecionado, setMesSelecionado] = useState(mesAtual)
    const [anoSelecionado] = useState(anoAtual)
    const [loading, setLoading] = useState(true)

    const [limite, setLimite] = useState(null)
    const [editandoLimite, setEditandoLimite] = useState(false)

    async function carregarTransacoes() {
        const { data, error } = await supabase
            .from(TABELA)
            .select('*')
            .order('date', { ascending: false })

        if (error) {
            console.error('Erro ao buscar transações:', error.message)
        } else {
            setTransacoes((data || []).map(t => ({
                id: t.id,
                descricao: t.description || 'Sem descrição',
                valor: Number(t.value || 0),
                tipo: normalizarTipo(t.type),
                categoria: t.category || 'Outros',
                data: String(t.date).slice(0, 10)
            })))
        }
    }

    async function carregarLimite() {
        const { data, error } = await supabase
            .from('configuracoes')
            .select('value_limit')
            .eq('id', 1)
            .maybeSingle()

        if (error) {
            console.error('Erro ao buscar limite:', error.message)
            return
        }
        setLimite(data ? Number(data.value_limit) : null)
    }

    async function carregarTudo() {
        await Promise.all([carregarTransacoes(), carregarLimite()])
        setLoading(false)
    }

    useEffect(() => {
        carregarTudo()
    }, [])

    function handleAdd() {
        carregarTransacoes()
    }

    function handleLimiteSalvo() {
        setEditandoLimite(false)
        carregarLimite()
    }

    const transacoesFiltradas = filtrarPorPeriodo(
        transacoes,
        filtro,
        hoje,
        { ano: anoSelecionado, mes: mesSelecionado }
    )
    const dadosGrafico = agruparPorCategoria(transacoesFiltradas)

    const totalGasto = transacoesFiltradas
        .filter((t) => t.tipo === 'saida')
        .reduce((soma, t) => soma + t.valor, 0)
    const limiteExcedido = limite !== null && totalGasto > limite

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

            <div className="limite">
                <div className="limite-info">
                    <p>
                        {limite !== null ? (
                            <>Limite total de gastos: <strong>{formatarReais(limite)}</strong> · </>
                        ) : (
                            <>Nenhum limite definido · </>
                        )}
                        Gasto no período: <strong>{formatarReais(totalGasto)}</strong>
                    </p>
                    {!editandoLimite && (
                        <button type="button" onClick={() => setEditandoLimite(true)}>
                            {limite !== null ? 'Alterar limite' : 'Definir limite'}
                        </button>
                    )}
                </div>

                {limiteExcedido && (
                    <div className="alerta-limite" role="alert">
                       Limite de gastos ultrapassado! Você gastou {formatarReais(totalGasto)},
                        {' '}{formatarReais(totalGasto - limite)} acima do limite de {formatarReais(limite)}.
                    </div>
                )}
            </div>

            <div className="grafico">
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>Carregando dados...</p>
                ) : (
                    <GraficoGastos dados={dadosGrafico} />
                )}
            </div>
        </div>

        <Transactionform onAdd={handleAdd} />

        {editandoLimite && (
            <LimiteForm
                onSalvo={handleLimiteSalvo}
                onCancelar={() => setEditandoLimite(false)}
            />
        )}
        </>
    )
}