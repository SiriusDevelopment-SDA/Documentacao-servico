"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

type UltimoData = {
  ultimaRegra?: { nome: string; createdAt: string };
  ultimaEmpresa?: { nome: string; createdAt: string };
};

export default function RegrasPage() {
  const [data, setData] = useState<UltimoData>({});

  useEffect(() => {
    fetch("http://localhost:3333/dashboard/ultimos")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Última Regra de Negócio</h2>
        {data.ultimaRegra ? (
          <>
            <p><b>Nome:</b> {data.ultimaRegra.nome}</p>
            <p><b>Data:</b> {new Date(data.ultimaRegra.createdAt).toLocaleDateString()}</p>
          </>
        ) : (
          <p>Nenhuma regra encontrada</p>
        )}
      </div>

      <div className={styles.card}>
        <h2>Última Empresa</h2>
        {data.ultimaEmpresa ? (
          <>
            <p><b>Nome:</b> {data.ultimaEmpresa.nome}</p>
            <p><b>Data:</b> {new Date(data.ultimaEmpresa.createdAt).toLocaleDateString()}</p>
          </>
        ) : (
          <p>Nenhuma empresa encontrada</p>
        )}
      </div>
    </div>
  );
}
