"use client"; // Adicione esta linha

import { useState } from "react";
import styles from "./parametro.module.scss";
import { Parametro } from '@/app/parametros-necessarios/types';  // Importe o tipo Parametro de 'types.ts'

interface ParametroSearchProps {
  parametros: Parametro[];
  onDelete: (id: number) => void;
  onEdit: (param: Parametro) => void;  // Tipagem correta de onEdit
}

const ParametroSearch = ({ parametros, onDelete, onEdit }: ParametroSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra os parâmetros de acordo com o termo de pesquisa
  const filteredParametros = parametros.filter((param) =>
    param.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.searchSection}>
      <input
        type="text"
        placeholder="Pesquisar Parâmetros..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <select className={styles.selectField}>
        {filteredParametros.length === 0 ? (
          <option>Sem parâmetros cadastrados</option>
        ) : (
          filteredParametros.map((param) => (
            <option key={param.id} value={param.id}>
              {param.nome}
            </option>
          ))
        )}
      </select>

      {/* Verifique se há parâmetros para exibir os botões */}
      {filteredParametros.length > 0 && (
        <div className={styles.buttons}>
          <button
            onClick={() => onEdit(filteredParametros[0] as Parametro)} // Garantir que o tipo seja 'Parametro'
            className={styles.button}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(filteredParametros[0].id)} // Garantir que o 'id' seja acessado corretamente
            className={styles.buttonExcluir}
          >
            Excluir
          </button>
        </div>
      )}
    </div>
  );
};

export default ParametroSearch;
