import { useState } from "react";

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
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

function sugerirCategoria(texto) {
  const t = texto.toLowerCase();

  if (t.includes("uber") || t.includes("posto") || t.includes("gasolina")) {
    return "Transporte";
  }
  if (t.includes("supermercado") || t.includes("ifood")) {
    return "Alimentação";
  }
  return null;
}

export default function TransactionForm({ onAdd }) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [limite, setLimite] = useState("");
  const [tipo, setTipo] = useState("saida");
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [categoriaManual, setCategoriaManual] = useState(false);
  const [data, setData] = useState(getHoje());
  const [erro, setErro] = useState("");

  function limparFormulario() {
    setDescricao("");
    setValor("");
    setTipo("saida");
    setCategoria(CATEGORIAS[0]);
    setCategoriaManual(false);
    setData(getHoje());
  }

  function handleDescricaoBlur() {
    const sugerida = sugerirCategoria(descricao);
    if (sugerida && !categoriaManual) {
      setCategoria(sugerida);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const valorNumerico = Number(valor);
    const limiteNumerico = Number(limite);

    if (!descricao.trim()) {
      setErro("Informe uma descrição.");
      return;
    }
    if (!valor || valorNumerico <= 0) {
      setErro("Informe um valor maior que zero.");
      return;
    }
    if (limite && limiteNumerico > 0 && valorNumerico > limiteNumerico) {
      setErro(
        `O valor (R$ ${valorNumerico.toFixed(2)}) ultrapassa o limite de gastos (R$ ${limiteNumerico.toFixed(2)}).`
      );
      return;
    }
    if (!data) {
      setErro("Informe uma data.");
      return;
    }

    setErro("");

    const novaTransacao = {
      id: crypto.randomUUID(),
      descricao: descricao.trim(),
      valor: valorNumerico,
      tipo,
      categoria,
      data,
    };

    onAdd(novaTransacao);
    limparFormulario();
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h2 className="transaction-form__title">Nova transação</h2>

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
          <label htmlFor="limite">Limite de gastos</label>
          <input
            id="limite"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={limite}
            onChange={(e) => setLimite(e.target.value)}
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

      <button type="submit" className="transaction-form__submit">
        Adicionar transação
      </button>
    </form>
  );
}