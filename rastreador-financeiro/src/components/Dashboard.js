import './Dashboard.css' 
import GraficoGastos from './GraficoGastos'
import Transactionform from './Transactionform'
import { useState } from 'react'
import { agruparPorCategoria, filtrarPorPeriodo } from './utils'

const MESES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const QUANTIDADE_ANOS = 100

function Dashboard (){
    const hoje = new Date()
    const anoAtual = hoje.getFullYear()
    const mesAtual = hoje.getMonth()

    const [transacoes, setTransacoes] = useState([])
    const [filtro, setFiltro] = useState('mes')
    const [mesSelecionado, setMesSelecionado] = useState(mesAtual)
    const [anoSelecionado, setAnoSelecionado] = useState(anoAtual)

    function handleAdd(novaTransacao) {
        setTransacoes((atuais) => [...atuais, novaTransacao])
    }

    function handleAno(e) {
        const ano = Number(e.target.value)
        setAnoSelecionado(ano)
        if (ano === anoAtual && mesSelecionado > mesAtual) {
            setMesSelecionado(mesAtual)
        }
    }

    const anos = Array.from({ length: QUANTIDADE_ANOS }, (_, i) => anoAtual - i)

    const transacoesFiltradas = filtrarPorPeriodo(
        transacoes,
        filtro,
        hoje,
        { ano: anoSelecionado, mes: mesSelecionado }
    )
    const dadosGrafico = agruparPorCategoria(transacoesFiltradas)

    return (
        <>
        <div className="dashboard">
            <div className="content">
                <div>
                    <h1>Dashboard</h1>
                </div>
                <div className="filtros">
                    <select
                        aria-label="Período"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    >
                        <option value="semana">Semana</option>
                        <option value="mes">Mês</option>
                        <option value="ano">Ano</option>
                    </select>

                    {filtro === 'mes' && (
                        <>
                        <select
                            aria-label="Mês"
                            value={mesSelecionado}
                            onChange={(e) => setMesSelecionado(Number(e.target.value))}
                        >
                            {MESES.map((nome, indice) => (
                                <option
                                    key={nome}
                                    value={indice}
                                    disabled={anoSelecionado === anoAtual && indice > mesAtual}
                                >
                                    {nome}
                                </option>
                            ))}
                        </select>
                        <select
                            aria-label="Ano"
                            value={anoSelecionado}
                            onChange={handleAno}
                        >
                            {anos.map((ano) => (
                                <option key={ano} value={ano}>{ano}</option>
                            ))}
                        </select>
                        </>
                    )}
                </div>
            </div>
            <div className="grafico">
                <GraficoGastos dados={dadosGrafico}/>
            </div>
            {dadosGrafico.valores.length === 0 && (
                <p className="grafico-vazio">Nenhum gasto registrado neste período.</p>
            )}
        </div>
        <Transactionform onAdd={handleAdd} />
        </>
    )
}

export default Dashboard;