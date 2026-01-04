"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/api";
import styles from "./styles.module.scss";
import Button from "@/components/ui/button/Button";

// Modais
import PreviewDevModal from "../../../components/modals/PreviewDevModal";
import PreviewContractModal from "../../../components/modals/PreviewContractModal";

/* ===============================
   TIPAGENS
================================ */
interface NomeServico {
  id: number;
  nome: string;
}

interface Servico {
  id: number;
  descricao?: string;
  parametros_padrao?: any;
  documentacaoId: number;
  erpId: number;
  nomeServicoId?: number;
  nomeServico?: NomeServico; // 🔹 relação correta
}

interface PrintableProps {
  data: any;
  services: Servico[];
}

/* ============================================
   PRINT DEV (PDF)
=============================================== */
function PrintableDev({ data, services }: PrintableProps) {
  if (!data) return null;

  return (
    <div id="print-dev" className={styles.printWrapper}>
      <h2 className={styles.printTitle}>
        PRÉVIA - REGISTRO DE DESENVOLVEDORES
      </h2>

      <section className={styles.printSection}>
        <h3>DADOS DO CONTRATO</h3>

        <p><strong>Nome da empresa:</strong> {data.nome_empresa ?? "Não informado"}</p>
        <p><strong>Nome do Contratante:</strong> {data.nome_contratante ?? "Não informado"}</p>
        <p><strong>Documentado por:</strong> {data.documentado_por ?? "Não informado"}</p>
        <p>
          <strong>Data:</strong>{" "}
          {data.data
            ? new Date(data.data).toLocaleDateString("pt-BR")
            : "Não informado"}
        </p>
        <p><strong>ERP Selecionado:</strong> {data.erp ?? "Não informado"}</p>
        <p><strong>Número do Contrato:</strong> {data.numero_contrato ?? "Não informado"}</p>
      </section>

      <section className={styles.printSection}>
        <h3>SERVIÇOS SELECIONADOS COM CONFIGURAÇÕES</h3>

        {services.map((service) => (
          <div key={service.id} className={styles.printServiceBox}>
            <h4>
              ✓ {service.nomeServico?.nome || "Serviço sem nome"}
            </h4>

            {service.descricao && (
              <p>
                <strong>Descrição:</strong> {service.descricao}
              </p>
            )}

            {service.parametros_padrao && (
              <pre className={styles.printCodeBlock}>
                {JSON.stringify(service.parametros_padrao, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

/* ============================================
   PRINT CONTRATO (PDF)
=============================================== */
function PrintableContract({ data, services }: PrintableProps) {
  if (!data) return null;

  return (
    <div id="print-contract" className={styles.printWrapper}>
      <h2 className={styles.printTitle}>
        PRÉVIA - CONTRATO DE SERVIÇOS
      </h2>

      <section className={styles.printSection}>
        <h3>DADOS DO CONTRATO</h3>

        <p><strong>Nome da empresa:</strong> {data.nome_empresa ?? "Não informado"}</p>
        <p><strong>Nome do Contratante:</strong> {data.nome_contratante ?? "Não informado"}</p>
        <p><strong>Documentado por:</strong> {data.documentado_por ?? "Não informado"}</p>
        <p>
          <strong>Data:</strong>{" "}
          {data.data
            ? new Date(data.data).toLocaleDateString("pt-BR")
            : "Não informado"}
        </p>
        <p><strong>ERP Selecionado:</strong> {data.erp ?? "Não informado"}</p>
        <p><strong>Número do Contrato:</strong> {data.numero_contrato ?? "Não informado"}</p>
      </section>

      <section className={styles.printSection}>
        <h3>SERVIÇOS SELECIONADOS</h3>

        {services.map((service) => (
          <div key={service.id} className={styles.printServiceLine}>
            ✓ {service.nomeServico?.nome || "Serviço sem nome"}
          </div>
        ))}
      </section>
    </div>
  );
}

/* ============================================
   PAGE
=============================================== */
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
  const [documentacaoData, setDocumentacaoData] = useState<any>(null);

  const [showDevPreview, setShowDevPreview] = useState(false);
  const [showContractPreview, setShowContractPreview] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  const totalPages = Math.ceil(filtered.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = filtered.slice(startIndex, startIndex + cardsPerPage);

  /* ===============================
     LOAD INICIAL
  ================================ */
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
        setNomeDocumentacao(resDoc.data.nome_contratante);

        const resErp = await api.get(`/erp/${erp}`);
        setNomeErp(resErp.data.nome);
      } catch (error) {
        console.log("Erro ao carregar dados:", error);
      }
    }

    if (!Number.isNaN(docId) && !Number.isNaN(erp)) {
      load();
    }
  }, [docId, erp]);

  /* 🔍 BUSCA PELO NOME DO SERVIÇO */
  useEffect(() => {
    const termo = search.toLowerCase();

    const results = servicos.filter((s) =>
      s.nomeServico?.nome?.toLowerCase().includes(termo)
    );

    setFiltered(results);
    setCurrentPage(1);
  }, [search, servicos]);

  /* 🗑️ DELETAR SERVIÇO */
  async function deletar(id: number) {
    if (!confirm("Deseja excluir este serviço?")) return;

    try {
      await api.delete(`/servico/${id}`);

      const updated = servicos.filter((s) => s.id !== id);
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
        <span>Documentação:</span>{" "}
        <strong>{nomeDocumentacao || "—"}</strong>
        <span className={styles.divider} />
        <span>ERP:</span>{" "}
        <strong>{nomeErp || "—"}</strong>
      </p>

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

        <Button variant="secondary" onClick={() => router.push("/")}>
          Finalizar
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
                <h3>{s.nomeServico?.nome || "Serviço sem nome"}</h3>
              </div>

              <div className={styles.cardBody}>
                <p>
                  {s.descricao
                    ? `${s.descricao.substring(0, 120)}...`
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

      {filtered.length > 0 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            ◀ Anterior
          </button>

          <span>
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima ▶
          </button>
        </div>
      )}

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
    </div>
  );
}
