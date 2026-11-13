import { supabase } from '../services/supabaseClient';

export async function getFilteredTransactions({ tipo, dataInicial, dataFinal }) {
  let query = supabase
    .from('id')
    .select('*')
    .order('date', { ascending: false }); 

  if (tipo && tipo !== 'todos') {
    query = query.eq('type', tipo);
  }

  if (dataInicial) {
    query = query.gte('date', dataInicial);
  }

  if (dataFinal) {
    query = query.lte('date', dataFinal);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar transações filtradas:', error.message);
    return [];
  }

  return data;
}

// Função para adicionar uma nova transação (ajustada para as colunas corretas)
export async function addTransaction(transactionData) {
  const { data, error } = await supabase
    .from('id') // Nome da tabela no Supabase
    .insert([
      {
        date: transactionData.date,               // Data da transação
        value: parseFloat(transactionData.value), // Valor numérico
        value_limit: transactionData.valueLimit ? parseFloat(transactionData.valueLimit) : null, // Limite de gastos (se houver)
        type: transactionData.type,               // 'Entrada' ou 'Saída'
        category: transactionData.category        // Categoria selecionada
      }
    ]);

  if (error) {
    console.error('Erro ao inserir transação:', error.message);
    return { success: false, error };
  }

  return { success: true, data };
}