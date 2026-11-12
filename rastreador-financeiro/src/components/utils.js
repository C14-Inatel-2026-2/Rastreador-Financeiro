function parseDataLocal(valor) {
    if (valor instanceof Date) return valor
    const [ano, mes, dia] = String(valor).split('-').map(Number)
    return new Date(ano, mes - 1, dia)
}

function subtrairMeses(data, meses) {
    const resultado = new Date(data.getFullYear(), data.getMonth() - meses, 1)
    const ultimoDia = new Date(resultado.getFullYear(), resultado.getMonth() + 1, 0).getDate()
    resultado.setDate(Math.min(data.getDate(), ultimoDia))
    return resultado
}

export function obterIntervalo(filtro, agora = new Date(), mesEscolhido = null) {
    const fimHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999)
    const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate())

    if (filtro === 'semana') {
        return { inicio: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 6), fim: fimHoje }
    }
    if (filtro === 'mes') {
        if (mesEscolhido) {
            const inicio = new Date(mesEscolhido.ano, mesEscolhido.mes, 1)
            const fimMes = new Date(mesEscolhido.ano, mesEscolhido.mes + 1, 0, 23, 59, 59, 999)
            // não inclui dias futuros quando o mês escolhido é o atual
            return { inicio, fim: fimMes < fimHoje ? fimMes : fimHoje }
        }
        return { inicio: subtrairMeses(hoje, 1), fim: fimHoje }
    }
    if (filtro === 'ano') {
        return { inicio: subtrairMeses(hoje, 12), fim: fimHoje }
    }
    return null
}

export function filtrarPorPeriodo(transacoes, filtro, agora = new Date(), mesEscolhido = null) {
    const intervalo = obterIntervalo(filtro, agora, mesEscolhido)
    if (!intervalo) return transacoes

    return transacoes.filter((t) => {
        const dataTransacao = parseDataLocal(t.data)
        return dataTransacao >= intervalo.inicio && dataTransacao <= intervalo.fim
    })
}

export function agruparPorCategoria(transacoes) {
    const totais = {}

    transacoes
    .filter((t) => t.tipo === 'saida')
    .forEach((t) => {
        totais[t.categoria] = (totais[t.categoria] || 0) + t.valor
    })

    return {
        labels: Object.keys(totais),
        valores: Object.values(totais),
    }
}