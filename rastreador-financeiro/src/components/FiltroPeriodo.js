const MESES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export default function FiltroPeriodo({
    filtro, onFiltro,
    mes, onMes,
    ano, onAno,
    anos,
}) {
    return (
        <div className="filtros-container">
            <select value={filtro} onChange={(e) => onFiltro(e.target.value)}>
                <option value="semana">Semana</option>
                <option value="mes">Mês</option>
                <option value="ano">Ano</option>
            </select>

            {filtro === 'mes' && (
                <select value={mes} onChange={(e) => onMes(Number(e.target.value))}>
                    {MESES.map((nome, index) => (
                        <option key={index} value={index}>{nome}</option>
                    ))}
                </select>
            )}

            {(filtro === 'mes' || filtro === 'ano') && (
                <select value={ano} onChange={(e) => onAno(Number(e.target.value))}>
                    {anos.map((a) => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                </select>
            )}
        </div>
    )
}