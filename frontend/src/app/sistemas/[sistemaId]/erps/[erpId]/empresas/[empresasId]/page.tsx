"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/api";
import styles from "./styles.module.scss";
import Button from "@/components/ui/button/Button";
import { ArrowLeftIcon } from "lucide-react";

// Modais
import PreviewDevModal from "@/app/listar/components/modals/PreviewDevModal";
import PreviewContractModal from "@/app/listar/components/modals/PreviewContractModal";

/* =============================
   TIPOS
============================== */
interface Servico {
  id: number;
  descricao?: string;
  parametros_padrao?: any;
  erpId: number;
  nomeServico?: string;
}

interface PrintableProps {
  data: any;
  services: Servico[];
}

/* =============================
   NORMALIZA SERVIÇO (🔥 FIX REAL)
============================== */
function normalizeServico(s: any): Servico {
  return {
    ...s,
    nomeServico:
      typeof s.nomeServico === "string"
        ? s.nomeServico
        : s.nomeServico?.nome ?? "",
  };
}

/* =============================
   PRINT DEV
============================== */
function PrintableDev({ data, services }: PrintableProps) {
  if (!data) return null;

  return (
    <div id="print-dev">
      <h2>PRÉVIA - REGISTRO DE DESENVOLVEDORES</h2>

      <p><strong>Empresa:</strong> {data.nome_empresa}</p>
      <p><strong>Contratante:</strong> {data.nome_contratante}</p>
      <p><strong>ERP:</strong> {data.erp}</p>

      <hr />

      {services.map((s) => (
        <div key={s.id} style={{ marginBottom: 16 }}>
          <strong>✓ {s.nomeServico || "Serviço sem nome"}</strong>
          {s.descricao && <p>{s.descricao}</p>}
          {s.parametros_padrao && (
            <pre>{JSON.stringify(s.parametros_padrao, null, 2)}</pre>
          )}
        </div>
      ))}
    </div>
  );
}

/* =============================
   PRINT CONTRATO
============================== */
function PrintableContract({ data, services }: PrintableProps) {
  if (!data) return null;

  return (
    <div id="print-contract" style={{ marginTop: 40 }}>
      <h2>PRÉVIA - CONTRATO DE SERVIÇOS</h2>

      <p><strong>Empresa:</strong> {data.nome_empresa}</p>
      <p><strong>Contratante:</strong> {data.nome_contratante}</p>
      <p><strong>ERP:</strong> {data.erp}</p>

      <hr />

      {services.map((s) => (
        <div key={s.id}>✓ {s.nomeServico || "Serviço sem nome"}</div>
      ))}
    </div>
  );
}

/* =============================
   PAGE
============================== */
export default function ListarServicosPage() {
  const params = useParams();
  const router = useRouter();

  const sistemaId = params.sistemaId as string;
  const erpId = Number(params.erpId);
  const empresasId = params.empresasId as string;

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [filtered, setFiltered] = useState<Servico[]>([]);
  const [search, setSearch] = useState("");

  const [showDevPreview, setShowDevPreview] = useState(false);
  const [showContractPreview, setShowContractPreview] = useState(false);

  /* =============================
     PAGINAÇÃO
  ============================== */
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  /* =============================
     LOAD — FILTRA POR ERP
  ============================== */
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/servico");

        const filtrados = res.data
          .filter((s: any) => Number(s.erpId) === erpId)
          .map(normalizeServico);

        setServicos(filtrados);
        setFiltered(filtrados);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        setServicos([]);
        setFiltered([]);
      }
    }

    if (!Number.isNaN(erpId)) {
      load();
    }
  }, [erpId]);

  /* =============================
     BUSCA
  ============================== */
  useEffect(() => {
    const searchLower = search.toLowerCase();

    setFiltered(
      servicos.filter((s) =>
        (s.nomeServico ?? "").toLowerCase().includes(searchLower)
      )
    );

    setCurrentPage(1);
  }, [search, servicos]);

  /* =============================
     PAGINAÇÃO
  ============================== */
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedServices = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* =============================
     EXCLUIR SERVIÇO
  ============================== */
  const handleExcluir = async (id: number) => {
    const confirm = window.confirm("Deseja realmente excluir este serviço?");
    if (!confirm) return;

    try {
      await api.delete(`/servico/delete/${id}`);

      setServicos((prev) => prev.filter((s) => s.id !== id));
      setFiltered((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      alert("Erro ao excluir serviço");
    }
  };

  /* =============================
     PDF (NÃO ALTERADO)
  ============================== */
  const generatePDF = async (elementId: string, filename: string) => {
    if (typeof window === "undefined") return;

    const element = document.getElementById(elementId);
    if (!element) {
      alert("Prévia não carregada");
      return;
    }

    const html2canvas = (await import("html2canvas")).default as any;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save(filename);
  };

  return (
    <div className={styles.container}>
      {/* VOLTAR */}
      <button
        className={styles.backButton}
        onClick={() => router.push(`/sistemas/${sistemaId}/erps/${erpId}`)}
      >
        <ArrowLeftIcon className={styles.backIcon} />
      </button>

      <h1 className={styles.title}>Serviços cadastrados</h1>

      {/* AÇÕES */}
      <div className={styles.previewActions}>
        <button className={styles.yellowBtn} onClick={() => setShowDevPreview(true)}>
          Prévia Dev
        </button>

        <button
          className={styles.yellowBtn}
          onClick={() => setShowContractPreview(true)}
        >
          Prévia Contrato
        </button>

        <button
          className={styles.blackBtn}
          onClick={() => generatePDF("print-dev", "registro-dev.pdf")}
        >
          Baixar Registro Dev
        </button>

        <button
          className={styles.blackBtn}
          onClick={() => generatePDF("print-contract", "contrato.pdf")}
        >
          Baixar Contrato
        </button>
      </div>

      {/* BUSCA */}
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

      {/* CARDS */}
      <ul className={styles.cardsGrid}>
        {paginatedServices.length === 0 ? (
          <p>Nenhum serviço encontrado.</p>
        ) : (
          paginatedServices.map((s) => (
            <li
              key={s.id}
              className={styles.cardItem}
              onClick={() =>
                router.push(
                  `/sistemas/${sistemaId}/erps/${erpId}/empresas/${empresasId}/adicionar/${empresasId}/${erpId}/servicos/${s.id}`
                )
              }
            >
              <h3>{s.nomeServico || "Serviço sem nome"}</h3>
              <p>{s.descricao || "Sem descrição"}</p>

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

      {/* PAGINAÇÃO */}
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

      {/* MODAIS */}
      {showDevPreview && (
        <PreviewDevModal
          onClose={() => setShowDevPreview(false)}
          data={{ erp: erpId }}
          selectedServices={servicos}
        />
      )}

      {showContractPreview && (
        <PreviewContractModal
          onClose={() => setShowContractPreview(false)}
          data={{ erp: erpId }}
          selectedServices={servicos}
        />
      )}

      {/* PDF OCULTO */}
      <div
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: "210mm",
          background: "#ffffff",
          padding: "20mm",
          color: "#000",
        }}
      >
        <PrintableDev data={{ erp: erpId }} services={servicos} />
        <PrintableContract data={{ erp: erpId }} services={servicos} />
      </div>
    </div>
  );
}
