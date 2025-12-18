"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Button from "@/components/ui/button/Button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { api } from "@/services/api";

interface NomeServico {
  id: number;
  nome: string;
}

export default function Page() {
  const {
    sistemaId,
    erpId,
    empresaId,
    docId,
    erpServicoId,
  } = useParams();

  const router = useRouter();

  const documentacaoId = Number(docId);
  const erpIdNumber = Number(erpId);

  const [documentacao, setDocumentacao] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     MODAL
  =============================== */
  const [openModal, setOpenModal] = useState(false);
  const [nomesServico, setNomesServico] = useState<NomeServico[]>([]);

  /* ===============================
     FORM
  =============================== */
  const [form, setForm] = useState({
    nome_servico: "",
    descricao_breve: "",
    instrucoes: "",
    sem_api: false,
    endpoint: "",
    parametros_padrao: "",
    exige_contrato: false,
    exige_cpf_cnpj: false,
    exige_login: false,
    responsavel: "",
  });

  /* ===============================
     LOAD DOCUMENTAÇÃO
  =============================== */
  useEffect(() => {
    async function loadDoc() {
      try {
        const response = await api.get(`/documentacoes/${documentacaoId}`);
        setDocumentacao(response.data);
      } catch (error) {
        console.error("Erro ao carregar documentação:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!isNaN(documentacaoId)) loadDoc();
  }, [documentacaoId]);

  /* ===============================
     LOAD NOMES SERVIÇO
  =============================== */
  async function openServicoModal() {
    try {
      const response = await api.get("/nome");
      setNomesServico(response.data);
      setOpenModal(true);
    } catch (error) {
      console.error("Erro ao carregar nomes de serviço:", error);
    }
  }

  /* ===============================
     HANDLE CHANGE
  =============================== */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, type, value, checked } = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  /* ===============================
     SUBMIT
  =============================== */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let parametrosJson = null;

    if (form.parametros_padrao.trim() !== "") {
      try {
        parametrosJson = JSON.parse(form.parametros_padrao);
      } catch {
        alert("Parâmetros JSON inválidos!");
        return;
      }
    }

    try {
      await api.post("/servico", {
        nomeServico: form.nome_servico,
        descricao: form.descricao_breve,
        instrucoes: form.instrucoes,
        sem_necessidade_api: form.sem_api,
        endpoint: form.endpoint,
        parametros_padrao: parametrosJson,
        exige_contrato: form.exige_contrato,
        exige_cpf_cnpj: form.exige_cpf_cnpj,
        exige_login_ativo: form.exige_login,
        responsavel_padrao: form.responsavel,
        documentacaoId,
        erpId: erpIdNumber,
      });

      alert("Serviço cadastrado com sucesso!");

      router.push(
        `/sistemas/${sistemaId}/erps/${erpId}/empresas/${empresaId}/adicionar/${docId}/${erpServicoId}`
      );
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      alert("Erro ao criar serviço.");
    }
  }

  if (loading) {
    return <h1 className={styles.title}>Carregando documentação...</h1>;
  }

  return (
    <div className={styles.wrapper}>
      {/* BOTÃO VOLTAR */}
      <Link
        href={`/sistemas/${sistemaId}/erps/${erpId}/empresas/${empresaId}/adicionar/${docId}/${erpServicoId}`}
        className={styles.backFloating}
      >
        <ArrowLeftIcon size={22} />
      </Link>

      <h1 className={styles.title}>
        Adicionar serviço à documentação:{" "}
        <strong>{documentacao?.nome_contratante || "—"}</strong>
      </h1>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        <label className={styles.label}>Nome do serviço</label>

        <div className={styles.inputWithButton}>
          <input
            className={styles.input}
            type="text"
            name="nome_servico"
            value={form.nome_servico}
            onChange={handleChange}
          />

          <Button
            type="button"
            variant="secondary"
            onClick={openServicoModal}
          >
            Selecionar serviço
          </Button>
        </div>

        <label className={styles.label}>Descrição interna</label>
        <input
          className={styles.input}
          type="text"
          name="descricao_breve"
          value={form.descricao_breve}
          onChange={handleChange}
        />

        <label className={styles.label}>Instruções</label>
        <textarea
          className={styles.textarea}
          name="instrucoes"
          value={form.instrucoes}
          onChange={handleChange}
        />

        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            name="sem_api"
            checked={form.sem_api}
            onChange={handleChange}
          />
          <span>Sem necessidade de API</span>
        </div>

        <label className={styles.label}>Endpoint / API</label>
        <input
          className={styles.input}
          type="text"
          name="endpoint"
          value={form.endpoint}
          onChange={handleChange}
        />

        <label className={styles.label}>Parâmetros (JSON)</label>
        <textarea
          className={styles.textarea}
          name="parametros_padrao"
          value={form.parametros_padrao}
          onChange={handleChange}
          placeholder='Ex: {"emails": [], "outros": []}'
        />

        <div className={styles.checkboxRow}>
          <label className={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="exige_contrato"
              checked={form.exige_contrato}
              onChange={handleChange}
            />
            Exige contrato
          </label>

          <label className={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="exige_cpf_cnpj"
              checked={form.exige_cpf_cnpj}
              onChange={handleChange}
            />
            Exige CPF/CNPJ
          </label>

          <label className={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="exige_login"
              checked={form.exige_login}
              onChange={handleChange}
            />
            Exige login ativo
          </label>
        </div>

        <label className={styles.label}>Responsável padrão</label>
        <input
          className={styles.input}
          type="text"
          name="responsavel"
          value={form.responsavel}
          onChange={handleChange}
        />

        <div className={styles.actions}>
          <Button variant="danger" type="button" onClick={() => router.back()}>
            Cancelar
          </Button>

          <Button type="submit" variant="primary">
            Adicionar Serviço
          </Button>
        </div>
      </form>

      {/* MODAL */}
      {openModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Selecionar serviço</h3>

            <div className={styles.modalList}>
              {nomesServico.map((item) => (
                <button
                  key={item.id}
                  className={styles.modalItem}
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      nome_servico: item.nome,
                    }));
                    setOpenModal(false);
                  }}
                >
                  {item.nome}
                </button>
              ))}
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpenModal(false)}
            >
              Fechar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
