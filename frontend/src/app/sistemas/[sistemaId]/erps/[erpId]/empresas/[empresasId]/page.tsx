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
  nomeServico?: {
    id: number;
    nome: string;
  };
}

/* =============================
   PDF — DEV
============================== */
function PrintableDev({
  erpId,
  services,
}: {
  erpId: number;
  services: Servico[];
}) {
  return (
    <div id="print-dev" style={{ width: "210mm", padding: "20mm", background: "#fff", color: "#000" }}>
      <h2>REGISTRO DE DESENVOLVEDORES</h2>
      <p><strong>ERP:</strong> {erpId}</p>
      <p><strong>Data:</strong> {new Date().toLocaleDateString()}</p>

      <hr />

      {services.map((s) => (
        <div key={s.id} style={{ marginBottom: 16 }}>
          <strong>✓ {s.nomeServico?.nome ?? "Serviço sem nome"}</strong>
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
   PDF — CONTRATO
============================== */
function PrintableContract({
  erpId,
  services,
}: {
  erpId: number;
  services: Servico[];
}) {
  return (
    <div id="print-contract" style={{ width: "210mm", padding: "20mm", background: "#fff", color: "#000" }}>
      <h2>CONTRATO DE SERVIÇOS</h2>
      <p><strong>ERP:</strong> {erpId}</p>
      <p><strong>Data:</strong> {new Date().toLocaleDateString()}</p>

      <hr />

      {services.map((s) => (
        <p key={s.id}>✓ {s.nomeServico?.nome ?? "Serviço sem nome"}</p>
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

  const [contractData, setContractData] = useState<any>(null);

  /* =============================
     PAGINAÇÃO
  ============================== */
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  /* =============================
     LOAD SERVIÇOS
  ============================== */
  useEffect(() => {
    async function loadServicos() {
      try {
        const res = await api.get("/servico");
        const filtrados = res.data.filter(
          (s: Servico) => Number(s.erpId) === erpId
        );
        setServicos(filtrados);
        setFiltered(filtrados);
      } catch (err) {
        console.error("Erro ao carregar serviços", err);
      }
    }

    if (!Number.isNaN(erpId)) loadServicos();
  }, [erpId]);

  /* =============================
     LOAD DOCUMENTAÇÃO (CONTRATO)
  ============================== */
  useEffect(() => {
    async function loadContrato() {
      try {
        const res = await api.get("/documentacoes");

        const contrato = res.data.find(
          (d: any) => Number(d.erpId) === erpId
        );

        setContractData(contrato ?? null);
      } catch (err) {
        console.error("Erro ao carregar documentação", err);
        setContractData(null);
      }
    }

    if (!Number.isNaN(erpId)) loadContrato();
  }, [erpId]);

  /* =============================
     BUSCA
  ============================== */
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      servicos.filter((s) =>
        (s.nomeServico?.nome ?? "").toLowerCase().includes(q)
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
     EXCLUIR
  ============================== */
  const handleExcluir = async (id: number) => {
    if (!confirm("Deseja realmente excluir este serviço?")) return;

    try {
      await api.delete(`/servico/delete/${id}`);
      setServicos((prev) => prev.filter((s) => s.id !== id));
      setFiltered((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Erro ao excluir serviço");
    }
  };

  /* =============================
     PDF (MANTIDO COMO ESTAVA)
  ============================== */
  const generatePDF = async (elementId: string, filename: string) => {
    if (typeof window === "undefined") return;

    await new Promise((r) => setTimeout(r, 300));

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
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  };

  return (
    <div className={styles.container}>
      {/* VOLTAR */}
      <button
        className={styles.backButton}
        onClick={() => router.push(`/sistemas/${sistemaId}/erps/${erpId}`)}
      >
        <ArrowLeftIcon />
      </button>

      <h1 className={styles.title}>Serviços cadastrados</h1>

      {/* BOTÕES SUPERIORES */}
      <div className={styles.previewActions}>
        <button
          className={styles.blackBtn}
          onClick={() => {
            if (!contractData) {
              alert("Nenhuma documentação encontrada para este ERP.");
              return;
            }
            setShowDevPreview(true);
          }}
        >
          Prévia Dev
        </button>

        <button
          className={styles.blackBtn}
          onClick={() => {
            if (!contractData) {
              alert("Nenhuma documentação encontrada para este ERP.");
              return;
            }
            setShowContractPreview(true);
          }}
        >
          Prévia Contrato
        </button>

        <button
          className={styles.yellowBtn}
          onClick={() => generatePDF("print-dev", "registro-dev.pdf")}
        >
          Baixar Registro Dev
        </button>

        <button
          className={styles.yellowBtn}
          onClick={() => generatePDF("print-contract", "contrato.pdf")}
        >
          Baixar Contrato
        </button>
      </div>

      {/* BUSCA + ADD */}
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

      {/* LISTAGEM */}
      <ul className={styles.cardsGrid}>
        {paginatedServices.map((s) => (
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
        ))}
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

      {/* PDF OCULTO — ALTERAÇÃO CRÍTICA (NÃO usar left negativo) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <PrintableDev erpId={erpId} services={servicos} />
        <PrintableContract erpId={erpId} services={servicos} />
      </div>
    </div>
  );
}
