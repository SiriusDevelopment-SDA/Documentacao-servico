"use client";

import styles from "./previewModal.module.scss";

interface PreviewContractModalProps {
  onClose: () => void;
  data: any;
  selectedServices?: any[];
}

export default function PreviewContractModal({
  onClose,
  data,
  selectedServices = [],
}: PreviewContractModalProps) {
  if (!data) return null;

  /* =========================
     NORMALIZAÇÃO DO ERP
  ========================= */

  const erpNome = (() => {
    if (typeof data?.erp === "string" || typeof data?.erp === "number") {
      return data.erp;
    }

    if (typeof data?.erp === "object" && data?.erp?.nome) {
      return data.erp.nome;
    }

    if (typeof data?.erp_nome === "string") {
      return data.erp_nome;
    }

    if (typeof data?.nome_erp === "string") {
      return data.nome_erp;
    }

    return "Não informado";
  })();

  /* =========================
     NORMALIZAÇÃO DO CONTRATO
  ========================= */

  const contrato = {
    nomeEmpresa:
      data?.nome_empresa ||
      data?.empresa?.nome ||
      data?.empresa_nome ||
      "Não informado",

    nomeContratante:
      data?.nome_contratante ||
      data?.contratante ||
      data?.responsavel ||
      "Não informado",

    documentadoPor:
      data?.documentado_por ||
      data?.usuario?.nome ||
      data?.criado_por ||
      "Não informado",

    dataContrato:
      data?.data ||
      data?.createdAt ||
      new Date().toLocaleDateString(),

    numeroContrato:
      data?.numero_contrato ||
      data?.id ||
      "Não informado",

    erp: erpNome,
  };

  /* =========================
     SERVIÇOS NORMALIZADOS
  ========================= */

  const servicos = Array.isArray(selectedServices)
    ? selectedServices.map((service) => ({
        id: service?.id ?? Math.random(),
        nome:
          service?.nomeServico?.nome ||   // ✅ CORREÇÃO DEFINITIVA
          service?.nome ||
          service?.descricao ||
          service?.servico?.nome ||
          "Serviço não identificado",
      }))
    : [];

  /* =========================
     RENDER
  ========================= */

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} id="contract-preview">
        <div className={styles.header}>
          <h2>PRÉVIA - CONTRATO DE SERVIÇOS</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            X
          </button>
        </div>

        <div className={styles.section}>
          <h3>DADOS DO CONTRATO</h3>

          <p><strong>Nome da empresa:</strong> {contrato.nomeEmpresa}</p>
          <p><strong>Nome do Contratante:</strong> {contrato.nomeContratante}</p>
          <p><strong>Documentado por:</strong> {contrato.documentadoPor}</p>
          <p><strong>Data:</strong> {contrato.dataContrato}</p>
          <p><strong>ERP Selecionado:</strong> {contrato.erp}</p>
          <p><strong>Número do Contrato:</strong> {contrato.numeroContrato}</p>
        </div>

        <div className={styles.section}>
          <h3>SERVIÇOS SELECIONADOS COM CONFIGURAÇÕES</h3>

          {servicos.length > 0 ? (
            servicos.map((service) => (
              <div key={service.id} className={styles.contractService}>
                ✓ {service.nome}
              </div>
            ))
          ) : (
            <p>Nenhum serviço selecionado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
