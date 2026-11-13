import './Dashboard.css'
import GraficoGastos from './GraficoGastos'
import Transactionform from './Transactionform'
import LimiteForm from './LimiteForm'
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
    const [anoSelecionado, setAnoSelecionado] = useState(anoAtual)
    const [loading, setLoading] = useState(true)
    const [transacaoEditando, setTransacaoEditando] = useState(null)
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

    async function handleExcluir(id) {
    if (!window.confirm('Deseja excluir esta transação?')) return

    const { error } = await supabase.from(TABELA).delete().eq('id', id)

    if (error) {
        alert('Erro ao excluir: ' + error.message)
        return
    }
    carregarTransacoes()
}

function handleEditar(transacao) {
    setTransacaoEditando(transacao)
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

    const anos = [...new Set([
    anoAtual,
    ...transacoes.map((t) => Number(t.data.slice(0, 4))),
])].sort((a, b) => b - a)

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

                    {(filtro === 'mes' || filtro === 'ano') && (
                        <select value={anoSelecionado} onChange={(e) => setAnoSelecionado(Number(e.target.value))}>
                            {anos.map((ano) => (
                                <option key={ano} value={ano}>{ano}</option>
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
            <div className="lista-transacoes">
                <h2>Transações</h2>
                {transacoesFiltradas.length === 0 ? (
                    <p>Nenhuma transação no período.</p>
                ) : (
                    <ul>
                        {transacoesFiltradas.map((t) => (
                            <li key={t.id}>
                                <span>{t.data.split('-').reverse().join('/')}</span>
                                <span>{t.descricao}</span>
                                <span>{t.categoria}</span>
                                <strong className={t.tipo}>
                                    {t.tipo === 'saida' ? '-' : '+'} {formatarReais(t.valor)}
                                </strong>
                                <button type="button" onClick={() => handleEditar(t)}>Editar</button>
                                <button type="button" onClick={() => handleExcluir(t.id)}>Excluir</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>

        <Transactionform
            onAdd={handleAdd}
            transacaoEditando={transacaoEditando}
            onCancelarEdicao={() => setTransacaoEditando(null)}
        />

        {editandoLimite && (
            <LimiteForm
                onSalvo={handleLimiteSalvo}
                onCancelar={() => setEditandoLimite(false)}
            />
        )}
        </>
    )
}