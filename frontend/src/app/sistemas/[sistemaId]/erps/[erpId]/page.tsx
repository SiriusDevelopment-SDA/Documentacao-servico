"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, SearchIcon } from "lucide-react";
import styles from "./styles.module.scss";

interface Contratante {
  documentacaoId?: number;
  nome_contratante: string;
}

export default function ContratantesPage() {
  const params = useParams();
  const router = useRouter();

  const sistemaId = params?.sistemaId as string;
  const erpId = params?.erpId as string;

  const [contratantes, setContratantes] = useState<Contratante[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!erpId) return;

    async function carregarContratantes() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://localhost:3333/api/erps/${erpId}/contratantes`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error("Erro ao buscar empresas");
        }

        const data = await res.json();
        setContratantes(data);
      } catch (err) {
        setError("Erro ao carregar empresas");
      } finally {
        setLoading(false);
      }
    }

    carregarContratantes();
  }, [erpId]);

  const contratantesFiltrados = contratantes.filter((c) =>
    c.nome_contratante.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className={styles.loading}>Carregando empresas...</p>;
  if (error) return <p className={styles.loading}>{error}</p>;

  return (
    <div className={styles.container}>
      {/* Botão voltar (padrão do sistema) */}
      <button
        className={styles.backButton}
        onClick={() => router.push(`/sistemas/${sistemaId}`)}
        title="Voltar"
      >
        <ArrowLeftIcon />
      </button>

      <div className={styles.content}>
        <h1 className={styles.title}>Empresas</h1>
        <p>Selecione a empresa</p>

        {/* Busca */}
        <div className={styles.searchBox}>
          <SearchIcon size={18} />
          <input
            type="text"
            placeholder="Buscar empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Cards */}
        <div className={styles.grid}>
          {contratantesFiltrados.map((c, index) => (
            <button
              key={index}
              className={styles.card}
              onClick={() => {
                if (!c.documentacaoId) {
                  alert(
                    "Esta empresa ainda não possui documentação vinculada."
                  );
                  return;
                }

                router.push(
                  `/sistemas/${sistemaId}/erps/${erpId}/empresas/${c.documentacaoId}`
                );
              }}
            >
              {c.nome_contratante}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
