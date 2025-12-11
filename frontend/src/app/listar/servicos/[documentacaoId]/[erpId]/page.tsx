"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/api";
import styles from "./styles.module.scss";
import Button from "@/components/ui/button/Button";

interface Servico {
  id: number;
  nome: string;
  descricao?: string;
  documentacaoId: number;
  erpId: number;
}

export default function ListarServicosPage() {
  const { documentacaoId, erpId } = useParams();
  const router = useRouter();

  const docId = Number(documentacaoId);
  const erp = Number(erpId);

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [filtered, setFiltered] = useState<Servico[]>([]);
  const [search, setSearch] = useState("");
  const [nomeDocumentacao, setNomeDocumentacao] = useState("");
  const [nomeErp, setNomeErp] = useState("");

  // PAGINAÇÃO
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  const totalPages = Math.ceil(filtered.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = filtered.slice(startIndex, startIndex + cardsPerPage);

  useEffect(() => {
    async function load() {
      try {
        const resServicos = await api.get("/servico");

        const filtrados = resServicos.data.filter(
          (s: Servico) =>
            s.documentacaoId === docId && s.erpId === erp
        );

        setServicos(filtrados);
        setFiltered(filtrados);

        const resDoc = await api.get(`/documentacao/${docId}`);
        setNomeDocumentacao(resDoc.data.nome_contratante || resDoc.data.nome);

        const resErp = await api.get(`/erp/${erp}`);
        setNomeErp(resErp.data.nome);

      } catch (error) {
        console.log("Erro ao carregar dados:", error);
      }
    }

    load();
  }, [docId, erp]);

  // BUSCA EM TEMPO REAL
  useEffect(() => {
    const results = servicos.filter(s =>
      s.nome.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
    setCurrentPage(1); // reset ao buscar
  }, [search, servicos]);

  async function deletar(id: number) {
    if (!confirm("Deseja excluir este serviço?")) return;

    try {
      await api.delete(`/servico/${id}`);
      const updated = servicos.filter(s => s.id !== id);
      setServicos(updated);
      setFiltered(updated);
    } catch (err) {
      console.log("Erro ao deletar", err);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Serviços cadastrados</h1>

      <p className={styles.subtitle}>
        <span>Documentação:</span> {nomeDocumentacao}
        <span className={styles.divider} />
        <span>ERP:</span> {nomeErp}
      </p>

      <div className={styles.topActions}>
        <input
          type="text"
          placeholder="Pesquisar serviço..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <Button onClick={() => router.push(`/criar/servicos/${docId}/${erp}`)}>
          Adicionar serviço
        </Button>
      </div>

      <ul className={styles.cardsGrid}>
        {currentCards.length === 0 ? (
          <p>Nenhum serviço encontrado.</p>
        ) : (
          currentCards.map((s) => (
            <li
              key={s.id}
              className={styles.cardItem}
              onClick={() => router.push(`/servicos/${s.id}`)}
            >
              <div className={styles.cardHeader}>
                <h3>{s.nome}</h3>
              </div>

              <div className={styles.cardBody}>
                <p>
                  {s.descricao
                    ? s.descricao.substring(0, 120) + "..."
                    : "Sem descrição"}
                </p>
              </div>

              <button
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  deletar(s.id);
                }}
              >
                Excluir
              </button>
            </li>
          ))
        )}
      </ul>

      {/* PAGINAÇÃO */}
      {filtered.length > 0 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            ◀ Anterior
          </button>

          <span>Página {currentPage} de {totalPages}</span>

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima ▶
          </button>
        </div>
      )}
    </div>
  );
}
