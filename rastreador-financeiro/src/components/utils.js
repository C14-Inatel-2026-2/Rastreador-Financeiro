export function filtrarPorPeriodo(transacoes, filtro) {
    const hoje = new Date()
    const inicio = new Date()

    if (filtro === 'semana'){
        inicio.setDate(hoje.getDate() - 7)
    } else if (filtro === 'mes') {
        inicio.setMonth(hoje.getMonth() - 1)
    } else if(filtro === 'ano') {
        inicio.setFullYear(hoje.getFullYear() - 1)
    }

    return transacoes.filter((t) => {
        const dataTransacao = new Date(t.data)
        return dataTransacao >= inicio && dataTransacao <= hoje
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