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
  nome: string;
  descricao?: string;
  parametros_padrao?: any;
  documentacaoId: number;
  erpId: number;
}

interface PrintableProps {
  data: any;
  services: Servico[];
}

/* =============================
   PRINT DEV (PDF)
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
          <strong>✓ {s.nome}</strong>
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
   PRINT CONTRATO (PDF)
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
        <div key={s.id}>✓ {s.nome}</div>
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
  const erpId = params.erpId as string;
  const empresasId = params.empresasId as string;

  const docId = Number(empresasId);
  const erp = Number(erpId);

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [filtered, setFiltered] = useState<Servico[]>([]);
  const [search, setSearch] = useState("");

  const [documentacaoData, setDocumentacaoData] = useState<any>(null);
  const [nomeDocumentacao, setNomeDocumentacao] = useState("");
  const [nomeErp, setNomeErp] = useState("");

  const [showDevPreview, setShowDevPreview] = useState(false);
  const [showContractPreview, setShowContractPreview] = useState(false);

  /* =============================
     LOAD
  ============================== */
  useEffect(() => {
    async function load() {
      try {
        const resServicos = await api.get("/servico");

        const filtrados = resServicos.data.filter(
          (s: Servico) =>
            Number(s.documentacaoId) === docId &&
            Number(s.erpId) === erp
        );

        setServicos(filtrados);
        setFiltered(filtrados);

        const resDoc = await api.get(`/documentacoes/${docId}`);
        setDocumentacaoData(resDoc.data);

        // ✅ ALTERAÇÃO AQUI
        setNomeDocumentacao(resDoc.data.nome_contratante);

        const resErp = await api.get(`/erp/${erp}`);
        setNomeErp(resErp.data.nome);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setServicos([]);
        setFiltered([]);
      }
    }

    if (!Number.isNaN(docId) && !Number.isNaN(erp)) {
      load();
    }
  }, [docId, erp]);

  /* =============================
     BUSCA
  ============================== */
  useEffect(() => {
    setFiltered(
      servicos.filter((s) =>
        s.nome.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, servicos]);

  /* =============================
     PDF (ESTÁVEL)
  ============================== */
  const generatePDF = async (elementId: string, filename: string) => {
    if (typeof window === "undefined") return;

    const element = document.getElementById(elementId);
    if (!element) {
      alert("Prévia não carregada");
      return;
    }

    const html2canvas = (
      await import("html2canvas")
    ).default as unknown as (
      element: HTMLElement,
      options?: any
    ) => Promise<HTMLCanvasElement>;

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
      {/* BOTÃO VOLTAR */}
      <button
        className={styles.backButton}
        onClick={() =>
          router.push(`/sistemas/${sistemaId}/erps/${erpId}`)
        }
      >
        <ArrowLeftIcon className={styles.backIcon} />
      </button>

      <h1 className={styles.title}>Serviços cadastrados</h1>

      <p className={styles.subtitle}>
        <span>{nomeDocumentacao}</span>
        <span className={styles.divider} />
        <span>{nomeErp}</span>
      </p>

      {/* BOTÕES */}
      <div className={styles.previewActions}>
        <button
          className={styles.yellowBtn}
          onClick={() => setShowDevPreview(true)}
        >
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
            router.push(`/criar/servicos/${docId}/${erp}`)
          }
        >
          Adicionar serviço
        </Button>
      </div>

      {/* CARDS */}
      <ul className={styles.cardsGrid}>
        {filtered.length === 0 ? (
          <p>Nenhum serviço encontrado.</p>
        ) : (
          filtered.map((s) => (
            <li
              key={s.id}
              className={styles.cardItem}
              onClick={() =>
                router.push(
                  `/sistemas/${sistemaId}/erps/${erpId}/empresas/${docId}/servicos/${s.id}`
                )
              }
            >
              <h3>{s.nome}</h3>
              <p>{s.descricao || "Sem descrição"}</p>

              <button
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Excluir
              </button>
            </li>
          ))
        )}
      </ul>

      {/* MODAIS */}
      {showDevPreview && (
        <PreviewDevModal
          onClose={() => setShowDevPreview(false)}
          data={documentacaoData}
          selectedServices={servicos}
        />
      )}

      {showContractPreview && (
        <PreviewContractModal
          onClose={() => setShowContractPreview(false)}
          data={documentacaoData}
          selectedServices={servicos}
        />
      )}

      {/* PDF INVISÍVEL */}
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
        <PrintableDev data={documentacaoData} services={servicos} />
        <PrintableContract data={documentacaoData} services={servicos} />
      </div>
    </div>
  );
}
