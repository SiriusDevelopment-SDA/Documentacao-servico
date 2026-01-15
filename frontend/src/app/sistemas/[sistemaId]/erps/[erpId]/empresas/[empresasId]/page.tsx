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
  erpName,
  services,
}: {
  erpName: string;
  services: Servico[];
}) {
  return (
    <div
      id="print-dev"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm",
        background: "#fff",
        color: "#000",
        fontFamily: "'Arial', sans-serif",
        fontSize: "12px",
        lineHeight: "1.6",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "18px" }}>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
          REGISTRO DE DESENVOLVEDORES
        </h2>

        <div
          style={{
            width: "100%",
            height: "1px",
            background: "#000",
            margin: "10px 0 12px",
            opacity: 0.6,
          }}
        />

        <p style={{ margin: "4px 0" }}>
          <strong>ERP:</strong> {erpName}
        </p>
        <p style={{ margin: "4px 0" }}>
          <strong>Data:</strong> {new Date().toLocaleDateString()}
        </p>
      </div>

      {services.map((s) => (
        <div
          key={s.id}
          style={{
            marginBottom: "20px",
            paddingBottom: "14px",
            borderBottom: "1px solid #ccc",
          }}
        >
          <strong style={{ fontSize: "14px" }}>
            ✓ {s.nomeServico?.nome ?? "Serviço sem nome"}
          </strong>

          {s.descricao && (
            <p style={{ margin: "6px 0", whiteSpace: "pre-wrap" }}>
              {s.descricao}
            </p>
          )}

          {s.parametros_padrao && (
            <pre
              style={{
                background: "#f4f4f4",
                padding: "10px",
                borderRadius: "6px",
                fontSize: "11px",
                overflowX: "auto",
                marginTop: "8px",
              }}
            >
              {JSON.stringify(s.parametros_padrao, null, 2)}
            </pre>
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
  erpName,
  services,
}: {
  erpName: string;
  services: Servico[];
}) {
  return (
    <div
      id="print-contract"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm",
        background: "#fff",
        color: "#000",
        fontFamily: "'Arial', sans-serif",
        fontSize: "12px",
        lineHeight: "1.6",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "18px" }}>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
          CONTRATO DE SERVIÇOS
        </h2>

        <div
          style={{
            width: "100%",
            height: "1px",
            background: "#000",
            margin: "10px 0 12px",
            opacity: 0.6,
          }}
        />

        <p style={{ margin: "4px 0" }}>
          <strong>ERP:</strong> {erpName}
        </p>
        <p style={{ margin: "4px 0" }}>
          <strong>Data:</strong> {new Date().toLocaleDateString()}
        </p>
      </div>

      <ul style={{ margin: 0, paddingLeft: "20px" }}>
        {services.map((s) => (
          <li key={s.id} style={{ marginBottom: "8px", fontSize: "13px" }}>
            ✓ {s.nomeServico?.nome ?? "Serviço sem nome"}
          </li>
        ))}
      </ul>
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

  const [erpName, setErpName] = useState<string>("Carregando...");

  const [showDevPreview, setShowDevPreview] = useState(false);
  const [showContractPreview, setShowContractPreview] = useState(false);

  const [contractData, setContractData] = useState<any>(null);

  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadErpName() {
      try {
        const res = await api.get(`/erp/${erpId}`);
        setErpName(res.data.nome);
      } catch (err) {
        setErpName(`ERP ${erpId}`);
      }
    }

    if (!Number.isNaN(erpId)) loadErpName();
  }, [erpId]);

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

  useEffect(() => {
    async function loadContrato() {
      try {
        const res = await api.get("/documentacoes");
        const contrato = res.data.find((d: any) => Number(d.erpId) === erpId);
        setContractData(contrato ?? null);
      } catch (err) {
        console.error("Erro ao carregar documentação", err);
        setContractData(null);
      }
    }

    if (!Number.isNaN(erpId)) loadContrato();
  }, [erpId]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      servicos.filter((s) =>
        (s.nomeServico?.nome ?? "").toLowerCase().includes(q)
      )
    );
    setCurrentPage(1);
  }, [search, servicos]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedServices = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
      <button
        className={styles.backButton}
        onClick={() => router.push(`/sistemas/${sistemaId}/erps/${erpId}`)}
      >
        <ArrowLeftIcon />
      </button>

      <h1 className={styles.title}>Serviços cadastrados</h1>

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
        <PrintableDev erpName={erpName} services={servicos} />
        <PrintableContract erpName={erpName} services={servicos} />
      </div>
    </div>
  );
}
