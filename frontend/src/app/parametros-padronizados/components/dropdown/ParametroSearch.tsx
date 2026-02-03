"use client";

import { useState } from "react";
import styles from "./parametro.module.scss";
import { Parametro } from "@/app/parametros-padronizados/types";

interface ParametroSearchProps {
  parametros: Parametro[] | undefined; // ← pode vir undefined
  onDelete: (id: number) => void;
  onEdit: (param: Parametro) => void;
}

const ParametroSearch = ({
  parametros,
  onDelete,
  onEdit,
}: ParametroSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // 🔒 GARANTIA DE ARRAY (EVITA CRASH)
  const safeParametros: Parametro[] = Array.isArray(parametros)
    ? parametros
    : [];

  // Filtra os parâmetros de acordo com o termo de pesquisa
  const filteredParametros = safeParametros.filter((param) =>
    param.nome?.toLowerCase().includes(searchTerm.toLowerCase())
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

      {filteredParametros.length > 0 && (
        <div className={styles.buttons}>
          <button
            onClick={() => onEdit(filteredParametros[0])}
            className={styles.button}
          >
            Editar
          </button>

          <button
            onClick={() => onDelete(filteredParametros[0].id)}
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
