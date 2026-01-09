import { useState, useEffect } from "react";
import styles from "./editModal.module.scss";  // Verifique o caminho do SCSS

interface Parametro {
  id: number;
  nome: string;
  valor: string;
  erpId: number;  // Certifique-se de que `erpId` é tratado como número
}

interface Erp {
  id: number;
  nome: string;
}

interface ModalUpdateProps {
  parametro: Parametro;
  onClose: () => void;
  onUpdate: (updatedParam: Parametro) => void;
  erps: Erp[]; // Tipagem adicionada para receber os ERPs
}


const ModalUpdate = ({ parametro, onClose, onUpdate }: ModalUpdateProps) => {
  const [nome, setNome] = useState(parametro.nome);
  const [valor, setValor] = useState(parametro.valor);
  const [erpId, setErpId] = useState<number>(parametro.erpId);  // Forçando erpId a ser sempre número

  // Função para buscar os ERPs
  const fetchErps = async (): Promise<Erp[]> => {
    try {
      const res = await fetch("https://api.coraxy.com.br/api/erp");  // URL da API para buscar ERPs
      const data: Erp[] = await res.json();  // Garantir tipagem dos ERPs
      return data; // Retorna os ERPs
    } catch (err) {
      console.error("Erro ao buscar ERPs:", err);
      return [];  // Retorna lista vazia em caso de erro
    }
  };

  // Carregar os ERPs quando o modal for aberto
  const [erps, setErps] = useState<Erp[]>([]);
  useEffect(() => {
    const loadErps = async () => {
      const erps = await fetchErps();
      setErps(erps);
    };
    loadErps();
  }, []); // Essa função vai ser chamada apenas quando o modal for aberto

  // Função para atualizar o parâmetro
  const handleUpdate = async () => {
    const updatedParam: Parametro = { ...parametro, nome, valor, erpId }; // Garantir que erpId seja passado como número
    try {
      await fetch(`https://api.coraxy.com.br/api/parametro/update/${updatedParam.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedParam),
      });
      onUpdate(updatedParam);  // Atualiza o parâmetro no componente pai
      onClose();  // Fecha o modal
    } catch (err) {
      console.error("Erro ao atualizar parâmetro:", err);
    }
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do Parâmetro"
          className={styles.modalInput}
        />
    
        <select
          value={erpId}
          onChange={(e) => setErpId(Number(e.target.value))}  // Garantindo que o valor será um número
          className={styles.modalSelect}
        >
          {erps.length > 0 ? (
            erps.map((erp: Erp) => (
              <option key={erp.id} value={erp.id}>
                {erp.nome}
              </option>
            ))
          ) : (
            <option>Carregando...</option>
          )}
        </select>
        <div className={styles.modalActions}>
          <button onClick={handleUpdate} className={styles.modalButton}>Salvar</button>
          <button onClick={onClose} className={styles.modalCancelButton}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalUpdate;
