"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/api";
import styles from "./styles.module.scss";
import Button from "@/components/ui/button/Button";
import { ArrowLeftIcon } from "lucide-react";

import PreviewDevModal from "@/app/listar/components/modals/PreviewDevModal";
import PreviewContractModal from "@/app/listar/components/modals/PreviewContractModal";

/* =============================
   HELPERS
============================== */
function normalizeNumber(value: any): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

/* =============================
   TIPOS
============================== */
interface Servico {
  id: number;
  descricao?: string;
  parametros_padrao?: any;
  erpId: number;
  nomeServico?: {
    id: number;
    nome: string;
  };
}

/* =============================
   PAGE
============================== */
export default function ListarServicosPage() {
  const params = useParams();
  const router = useRouter();

  const sistemaId = (params as any)?.sistemaId;
  const empresasId = (params as any)?.empresasId;

  const docId = normalizeNumber(
    (params as any)?.idDocumentacao ??
      (params as any)?.documentacaoId ??
      empresasId
  );

  const erpId = normalizeNumber(
    (params as any)?.idErp ??
      (params as any)?.erpId
  );

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [filtered, setFiltered] = useState<Servico[]>([]);
  const [search, setSearch] = useState("");

  const [erpName, setErpName] = useState("—");
  const [contractData, setContractData] = useState<any>(null);

  const [showDevPreview, setShowDevPreview] = useState(false);
  const [showContractPreview, setShowContractPreview] = useState(false);

  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  /* =============================
     ERP
  ============================== */
  useEffect(() => {
    async function loadErp() {
      try {
        const res = await api.get(`/erp/${erpId}`);
        setErpName(res.data?.nome ?? `ERP ${erpId}`);
      } catch {
        setErpName(`ERP ${erpId}`);
      }
    }

    if (!Number.isNaN(erpId)) loadErp();
  }, [erpId]);

  /* =============================
     SERVIÇOS
  ============================== */
  useEffect(() => {
    async function loadServicos() {
      try {
        const res = await api.get("/servico", {
          params: { documentacaoId: docId, erpId },
          headers: { "Cache-Control": "no-cache" },
        });

        const lista = Array.isArray(res.data) ? res.data : [];
        setServicos(lista);
        setFiltered(lista);
      } catch (err) {
        console.error("Erro ao carregar serviços", err);
        setServicos([]);
        setFiltered([]);
      }
    }

    if (!Number.isNaN(docId) && !Number.isNaN(erpId)) {
      loadServicos();
    }
  }, [docId, erpId]);

  /* =============================
     DOCUMENTAÇÃO
  ============================== */
  useEffect(() => {
    async function loadContrato() {
      try {
        const res = await api.get(`/documentacoes/${docId}`);
        setContractData(res.data ?? null);
      } catch {
        setContractData(null);
      }
    }

    if (!Number.isNaN(docId)) loadContrato();
  }, [docId]);

  /* =============================
     BUSCA
  ============================== */
  useEffect(() => {
    const q = search.toLowerCase().trim();
    setFiltered(
      servicos.filter((s) =>
        (s.nomeServico?.nome ?? "").toLowerCase().includes(q)
      )
    );
    setCurrentPage(1);
  }, [search, servicos]);

  /* =============================
     DELETE
  ============================== */
  async function handleExcluir(id: number) {
    if (!confirm("Deseja realmente excluir este serviço?")) return;

    try {
      await api.delete(`/servico/delete/${id}`);
      setServicos((p) => p.filter((s) => s.id !== id));
      setFiltered((p) => p.filter((s) => s.id !== id));
    } catch {
      alert("Erro ao excluir serviço");
    }
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className={styles.container}>
      <button
        className={styles.backButton}
        onClick={() => router.push(`/sistemas/${sistemaId}/erps/${erpId}`)}
      >
        <ArrowLeftIcon />
      </button>

      <h1 className={styles.title}>Serviços cadastrados</h1>

      <div className={styles.topActions}>
        <input
          className={styles.searchInput}
          placeholder="Pesquisar serviço..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          onClick={() =>
            router.push(
              `/sistemas/${sistemaId}/erps/${erpId}/empresas/${empresasId}/adicionar/${empresasId}/${erpId}`
            )
          }
        >
          Adicionar serviço
        </Button>
      </div>

      <ul className={styles.cardsGrid}>
        {paginated.length === 0 ? (
          <p>Nenhum serviço encontrado.</p>
        ) : (
          paginated.map((s) => (
            <li
              key={s.id}
              className={styles.cardItem}
              onClick={() =>
                router.push(
                  `/sistemas/${sistemaId}/erps/${erpId}/empresas/${empresasId}/adicionar/${empresasId}/${erpId}/servicos/${s.id}`
                )
              }
            >
              <h3>{s.nomeServico?.nome ?? "Serviço sem nome"}</h3>
              <p>{s.descricao ?? "Sem descrição"}</p>

              <button
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExcluir(s.id);
                }}
              >
                Excluir
              </button>
            </li>
          ))
        )}
      </ul>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Próxima
          </button>
        </div>
      )}

      {showDevPreview && contractData && (
        <PreviewDevModal
          onClose={() => setShowDevPreview(false)}
          data={contractData}
          selectedServices={servicos}
        />
      )}

      {showContractPreview && contractData && (
        <PreviewContractModal
          onClose={() => setShowContractPreview(false)}
          data={contractData}
          selectedServices={servicos}
        />
      )}
    </div>
  );
}
