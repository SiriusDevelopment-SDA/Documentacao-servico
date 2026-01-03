"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/api";
import styles from "./styles.module.scss";
import Button from "@/components/ui/button/Button";
import EditServiceModal from "./EditServiceModal";

type NomeServico =
  | string
  | {
      id: number;
      nome: string;
    };

interface Servico {
  id: number;

  // ✅ pode vir assim (novo)
  nomeServico?: NomeServico;

  // ✅ pode vir assim (antigo)
  nome?: string;

  descricao?: string;
  instrucoes?: string;
  endpoint?: string;

  parametros_padrao?: any;

  exige_contrato?: boolean;
  exige_cpf_cnpj?: boolean;
  exige_login_ativo?: boolean;
}

/** ✅ Normaliza o "nome do serviço" vindo do backend (string ou objeto) */
function getNomeDoServico(servico: Servico) {
  if (typeof servico?.nomeServico === "string") return servico.nomeServico;
  if (servico?.nomeServico && typeof servico.nomeServico === "object") {
    return servico.nomeServico.nome ?? "";
  }
  return servico?.nome ?? "";
}

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [servico, setServico] = useState<Servico | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  async function loadServico() {
    setLoading(true);
    try {
      const { data } = await api.get(`/servico/${id}`);
      setServico(data);
    } catch (error) {
      console.error("Erro ao carregar serviço:", error);
      setServico(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServico();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p className={styles.loading}>Carregando...</p>;
  if (!servico) return <p>Serviço não encontrado.</p>;

  const nomeDoServico = getNomeDoServico(servico);

  return (
    <div className={styles.container}>
      {/* BOTÃO VOLTAR */}
      <Button onClick={() => router.back()} variant="primary">
        Voltar
      </Button>

      {/* TÍTULO */}
      <h1 className={styles.title}>{nomeDoServico || "Serviço"}</h1>

      {/* CARD DE INFORMAÇÕES */}
      <div className={styles.infoCard}>
        {/* ✅ Nome do serviço acima da descrição (como você pediu) */}
        <h2 className={styles.cardTitle}>{nomeDoServico || "Serviço sem nome"}</h2>

        <p>
          <strong>Descrição:</strong>{" "}
          {servico.descricao?.trim() ? servico.descricao : "Sem descrição"}
        </p>

        <p><strong>Instruções:</strong></p>
        <pre className={styles.block}>
          {servico.instrucoes?.trim()
            ? servico.instrucoes
            : "Nenhuma instrução cadastrada."}
        </pre>

        <p>
          <strong>Endpoint:</strong>{" "}
          {servico.endpoint?.trim() ? servico.endpoint : "-"}
        </p>

        <p><strong>Parâmetros padrão:</strong></p>
        <pre className={styles.block}>
          {servico.parametros_padrao
            ? JSON.stringify(servico.parametros_padrao, null, 2)
            : "{}"}
        </pre>

        <p>
          <strong>Exige contrato:</strong>{" "}
          {servico.exige_contrato ? "Sim" : "Não"}
        </p>
        <p>
          <strong>Exige CPF/CNPJ:</strong>{" "}
          {servico.exige_cpf_cnpj ? "Sim" : "Não"}
        </p>
        <p>
          <strong>Exige login ativo:</strong>{" "}
          {servico.exige_login_ativo ? "Sim" : "Não"}
        </p>
      </div>

      {/* BOTÃO EDITAR */}
      <div className={styles.actions}>
        <Button variant="primary" onClick={() => setShowEditModal(true)}>
          Editar serviço
        </Button>
      </div>

      {/* MODAL */}
      {showEditModal && (
        <EditServiceModal
          servico={servico as any}
          onClose={() => setShowEditModal(false)}
          onUpdated={loadServico}
        />
      )}
    </div>
  );
}
