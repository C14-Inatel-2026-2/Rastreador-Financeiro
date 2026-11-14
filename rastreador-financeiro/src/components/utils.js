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
            return { inicio, fim: fimMes < fimHoje ? fimMes : fimHoje }
        }
        return { inicio: subtrairMeses(hoje, 1), fim: fimHoje }
    }
    if (filtro === 'ano') {
    if (mesEscolhido) {
        const inicio = new Date(mesEscolhido.ano, 0, 1)
        const fimAno = new Date(mesEscolhido.ano, 11, 31, 23, 59, 59, 999)
        return { inicio, fim: fimAno < fimHoje ? fimAno : fimHoje }
    }
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
const PALAVRAS_CHAVE = {
    Transporte: ['uber', 'onibus', 'gasolina'],
    Alimentação: ['mercado', 'supermercado', 'comida', 'ifood', 'restaurante', 'lanche'],
    Salário: ['salario', 'pix', 'recebimento'],
}

function removerAcentos(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function sugerirCategoria(texto) {
    const t = removerAcentos(texto)
    const encontrada = Object.entries(PALAVRAS_CHAVE)
        .find(([, palavras]) => palavras.some((p) => t.includes(p)))
    return encontrada ? encontrada[0] : null
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

export function formatarReais(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function calcularTotalGasto(transacoes) {
    return transacoes
        .filter((t) => t.tipo === 'saida')
        .reduce((soma, t) => soma + t.valor, 0)
}

export function listarAnos(transacoes, anoAtual) {
    const anos = transacoes.map((t) => Number(t.data.slice(0, 4)))
    return [...new Set([anoAtual, ...anos])].sort((a, b) => b - a)
}