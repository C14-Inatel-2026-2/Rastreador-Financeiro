import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import './Transactionform.css'

const CATEGORIAS = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Lazer",
  "Saúde",
  "Educação",
  "Salário",
  "Outros",
];

function getHoje() {
  return new Date().toISOString().split("T")[0];
}

export default function Transactionform({ onAdd, transacaoEditando, onCancelarEdicao }) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("saida");
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [categoriaManual, setCategoriaManual] = useState(false);
  const [data, setData] = useState(getHoje());
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (transacaoEditando) {
      setDescricao(transacaoEditando.descricao);
      setValor(String(transacaoEditando.valor));
      setTipo(transacaoEditando.tipo);
      setCategoria(transacaoEditando.categoria);
      setCategoriaManual(true);
      setData(transacaoEditando.data);
      setErro("");
    }
  }, [transacaoEditando]);

  function sugerirCategoria(texto) {
    // ignora maiúsculas e acentos ("Salário" -> "salario", "Ônibus" -> "onibus")
    const t = texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const regras = [
      ["Transporte", ["uber", "onibus", "gasolina"]],
      ["Alimentação", ["mercado", "supermercado", "comida", "ifood", "restaurante", "lanche"]],
      ["Salário", ["salario", "pix", "recebimento"]],
    ];

    for (const [nomeCategoria, palavras] of regras) {
      if (palavras.some((p) => t.includes(p))) return nomeCategoria;
    }
    return null;
  }

  function handleDescricaoBlur() {
    const sugerida = sugerirCategoria(descricao);
    if (sugerida && !categoriaManual) {
      setCategoria(sugerida);
    }
  }

  function limparFormulario() {
    setDescricao("");
    setValor("");
    setTipo("saida");
    setCategoria(CATEGORIAS[0]);
    setCategoriaManual(false);
    setData(getHoje());
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const valorNumerico = Number(valor);

    if (!descricao.trim()) {
      setErro("Informe uma descrição.");
      return;
    }
    if (!valor || valorNumerico <= 0) {
      setErro("Informe um valor maior que zero.");
      return;
    }
    if (!data) {
      setErro("Informe uma data.");
      return;
    }

    setErro("");
    setCarregando(true);

    try {
      const novaTransacaoSupabase = {
        date: data,
        value: valorNumerico,
        type: tipo,
        category: categoria,
        description: descricao.trim(),
      };

      let resultado;

      if (transacaoEditando) {
        resultado = await supabase
          .from("id")
          .update(novaTransacaoSupabase)
          .eq("id", transacaoEditando.id)
          .select();
      } else {
        resultado = await supabase
          .from("id")
          .insert([novaTransacaoSupabase])
          .select();
      }

      const { data: dadosInseridos, error } = resultado;

      if (error) {
        throw error;
      }

      const transacaoCriada = dadosInseridos ? dadosInseridos[0] : novaTransacaoSupabase;

      if (onAdd) {
        onAdd({
          id: transacaoCriada.id || crypto.randomUUID(),
          descricao: transacaoCriada.description,
          valor: transacaoCriada.value,
          tipo: transacaoCriada.type,
          categoria: transacaoCriada.category,
          data: transacaoCriada.date,
        });
      }

      limparFormulario();

      if (transacaoEditando && onCancelarEdicao) {
        onCancelarEdicao();
      }
    } catch (err) {
      console.error("Erro ao salvar:", err.message);
      setErro("Erro ao salvar no banco de dados: " + err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h2 className="transaction-form__title">
        {transacaoEditando ? "Editar transação" : "Nova transação"}
      </h2>

      <div className="transaction-form__field">
        <label htmlFor="descricao">Descrição</label>
        <input
          id="descricao"
          type="text"
          placeholder="Ex: Supermercado, Salário..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          onBlur={handleDescricaoBlur}
        />
      </div>

      <div className="transaction-form__row">
        <div className="transaction-form__field">
          <label htmlFor="valor">Valor (R$)</label>
          <input
            id="valor"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>

        <div className="transaction-form__field">
          <label htmlFor="data">Data</label>
          <input
            id="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
      </div>

      <div className="transaction-form__row">
        <div className="transaction-form__field">
          <label htmlFor="categoria">Categoria</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => {
              setCategoria(e.target.value);
              setCategoriaManual(true);
            }}
          >
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="transaction-form__field">
          <span className="transaction-form__label-fake">Tipo</span>
          <div className="transaction-form__toggle">
            <button
              type="button"
              className={tipo === "entrada" ? "is-active entrada" : "entrada"}
              onClick={() => setTipo("entrada")}
            >
              Entrada
            </button>
            <button
              type="button"
              className={tipo === "saida" ? "is-active saida" : "saida"}
              onClick={() => setTipo("saida")}
            >
              Saída
            </button>
          </div>
        </div>
      </div>

      {erro && <p className="transaction-form__erro">{erro}</p>}

      <button type="submit" className="transaction-form__submit" disabled={carregando}>
        {carregando ? "Salvando..." : transacaoEditando ? "Salvar alterações" : "Adicionar transação"}
      </button>

      {transacaoEditando && (
        <button
          type="button"
          onClick={() => {
            limparFormulario();
            onCancelarEdicao();
          }}
        >
          Cancelar edição
        </button>
      )}
    </form>
  );
}