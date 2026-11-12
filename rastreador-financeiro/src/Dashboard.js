import React, { useState, useEffect } from 'react';
import { getFilteredTransactions } from '../repositories/transactionService';

export function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState('saida'); 
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const carregarDados = async () => {
    const dados = await getFilteredTransactions({
      tipo: tipoFiltro,
      dataInicial: dataInicio,
      dataFinal: dataFim
    });
    setTransactions(dados);
  };

  useEffect(() => {
    carregarDados();
  }, [tipoFiltro]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Rastreamento de Saídas por Data</h2>

      {/* Seção de Filtros */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div>
          <label>Tipo:</label>
          <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="entrada">Entradas</option>
            <option value="saida">Saídas</option>
          </select>
        </div>

        <div>
          <label>Data Inicial:</label>
          <input 
            type="date" 
            value={dataInicio} 
            onChange={(e) => setDataInicio(e.target.value)} 
          />
        </div>

        <div>
          <label>Data Final:</label>
          <input 
            type="date" 
            value={dataFim} 
            onChange={(e) => setDataFim(e.target.value)} 
          />
        </div>

        <button onClick={carregarDados} style={{ alignSelf: 'flex-end' }}>
          Filtrar
        </button>
      </div>
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.date} - {t.description}: R$ {t.amount} ({t.category})
          </li>
        ))}
      </ul>
    </div>
  );
}