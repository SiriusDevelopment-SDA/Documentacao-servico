"use client"; // Adicione esta linha

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import ModalUpdate from "./components/modal/EditModalParametro";
import ParametroSearch from "./components/dropdown/ParametroSearch";
import { Parametro } from './types';  // Importe o tipo Parametro de 'types.ts'

interface Erp {
  id: number;
  nome: string;
}

export default function ParametrosPadronizados() {
  const [parametros, setParametros] = useState<Parametro[]>([]);
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [erpId, setErpId] = useState<number>(0); // Estado para o erpId
  const [showModal, setShowModal] = useState(false);
  const [parametroAtualizar, setParametroAtualizar] = useState<Parametro | null>(null);
  const [erps, setErps] = useState<Erp[]>([]); // Estado para os ERPs

  // Função para carregar os parâmetros da API
  const fetchParametros = async () => {
    try {
      const res = await fetch("https://api.coraxy.com.br/api/parametros"); // URL da API
      const data = await res.json();
      setParametros(data);
    } catch (err) {
      console.error("Erro ao buscar parâmetros:", err);
    }
  };

  // Função para carregar os ERPs da API
  const fetchErps = async () => {
    try {
      const res = await fetch("https://api.coraxy.com.br/api/erp"); // URL da API para ERPs
      const data = await res.json();
      setErps(data);
    } catch (err) {
      console.error("Erro ao buscar ERPs:", err);
    }
  };

  // Função para criar um parâmetro
  const criarParametro = async () => {
    if (nome && erpId !== 0) { // Verifica se erpId não é 0
      const novoParametro = { nome, erpId };

      try {
        const res = await fetch("https://api.coraxy.com.br/api/parametro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoParametro),
        });
        const data = await res.json();
        setParametros([...parametros, data]);
        setNome(""); // Limpar campo de nome
        setValor(""); // Limpar campo de valor
        setErpId(0); // Limpar o campo de erpId
      } catch (err) {
        console.error("Erro ao criar parâmetro:", err);
      }
    } else {
      console.error("Por favor, selecione um ERP válido.");
    }
  };

  // Função para excluir um parâmetro
  const excluirParametro = async (id: number) => {
    try {
      await fetch(`https://api.coraxy.com.br/api/parametro/delete/${id}`, {
        method: "DELETE",
      });
      setParametros(parametros.filter((param) => param.id !== id)); // Atualiza o estado com os parâmetros restantes
    } catch (err) {
      console.error("Erro ao excluir parâmetro:", err);
    }
  };

  // Função para salvar a edição de um parâmetro
  const salvarEdicao = async (parametroAtualizado: Parametro) => {
    try {
      await fetch(`https://api.coraxy.com.br/api/parametro/update/${parametroAtualizado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: parametroAtualizado.nome,
          valor: parametroAtualizado.valor,
          erpId: parametroAtualizado.erpId, // Passando o erpId na edição
        }),
      });

      setParametros(
        parametros.map((param) =>
          param.id === parametroAtualizado.id ? parametroAtualizado : param
        )
      );
      setShowModal(false);
      setParametroAtualizar(null);
    } catch (err) {
      console.error("Erro ao atualizar parâmetro:", err);
    }
  };

  useEffect(() => {
    fetchParametros(); // Carregar parâmetros quando o componente for montado
    fetchErps(); // Carregar os ERPs
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Parâmetros Padronizados</h1>

      {/* Formulário para criar parâmetro */}
      <div className={styles.form}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do Parâmetro"
          className={styles.inputField}
        />
        <select
          value={erpId}
          onChange={(e) => setErpId(Number(e.target.value))}
          className={styles.inputField}
        >
          <option value={0}>Selecione o ERP</option>
          {erps.map((erp) => (
            <option key={erp.id} value={erp.id}>
              {erp.nome}
            </option>
          ))}
        </select>
        <button onClick={criarParametro} className={styles.button}>Cadastrar Parâmetro</button>
        {/* Exibir mensagem de erro se o ERP não for selecionado */}
        {erpId === 0 && <p className={styles.error}>Por favor, selecione um ERP.</p>}
      </div>

      {/* Lista de parâmetros cadastrados */}
      <ParametroSearch
        parametros={parametros}
        onDelete={excluirParametro}
        onEdit={(param: Parametro) => {  // Tipando o 'param' explicitamente
          // Garantir que o parâmetro tenha 'erpId' e todas as propriedades necessárias
          const parametroCompleto: Parametro = { 
            ...param, 
            erpId: param.erpId || 0  // Garantir que 'erpId' esteja presente e não seja undefined
          };
          setParametroAtualizar(parametroCompleto);  // Passando o parâmetro completo
          setShowModal(true);
        }}
      />

      {/* Modal para atualização de parâmetro */}
      {showModal && parametroAtualizar && (
        <ModalUpdate
          parametro={parametroAtualizar}
          onClose={() => setShowModal(false)}
          onUpdate={salvarEdicao}
          erps={erps} // Passando os ERPs para o modal
        />
      )}
    </div>
  );
}
