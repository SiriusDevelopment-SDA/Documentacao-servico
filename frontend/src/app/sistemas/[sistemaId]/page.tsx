"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import styles from "./styles.module.scss";

interface Erp {
  id: number;
  nome: string;
}

export default function ErpsDoSistemaPage() {
  const { sistemaId } = useParams();
  const router = useRouter();

  const [erps, setErps] = useState<Erp[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function carregarErps() {
      try {
        const response = await fetch(
          `http://localhost:3333/api/sistema/${sistemaId}/erps`
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar ERPs do sistema");
        }

        const json = await response.json();
        setErps(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os ERPs.");
      } finally {
        setLoading(false);
      }
    }

    carregarErps();
  }, [sistemaId]);

  const erpsFiltrados = erps.filter((erp) =>
    erp.nome.toLowerCase().includes(search.toLowerCase())
  );

  /* ------------------ estados ------------------ */

  if (loading) {
    return <p style={{ color: "#fff", padding: 40 }}>Carregando ERPs...</p>;
  }

  if (error) {
    return <p style={{ color: "red", padding: 40 }}>{error}</p>;
  }

  if (erps.length === 0) {
    return (
      <p style={{ color: "#fff", padding: 40 }}>
        Nenhum ERP encontrado para este sistema.
      </p>
    );
  }

  /* ------------------ render ------------------ */

  return (
    <div className={styles.container}>
      {/* 🔙 Seta padrão → volta para /sistemas */}
      <button
        className={styles.backButton}
        onClick={() => router.push("/sistemas")}
        title="Voltar para sistemas"
      >
        <ArrowLeftIcon />
      </button>

      <div className={styles.content}>
        <h1 className={styles.title}>ERPs do sistema</h1>
        <p className={styles.subtitle}>Selecione um ERP para continuar</p>

        {/* 🔍 Barra de pesquisa */}
        <input
          type="text"
          className={styles.search}
          placeholder="Buscar ERP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Cards */}
        <div className={styles.grid}>
          {erpsFiltrados.map((erp) => (
            <button
              key={erp.id}
              className={styles.card}
              onClick={() =>
                router.push(`/sistemas/${sistemaId}/erps/${erp.id}`)
              }
            >
              {erp.nome}
            </button>
          ))}
        </div>

        {/* Nenhum resultado */}
        {erpsFiltrados.length === 0 && (
          <p style={{ color: "#fff", marginTop: 30 }}>
            Nenhum ERP encontrado com esse nome.
          </p>
        )}
      </div>
    </div>
  );
}
