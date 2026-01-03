"use client";

import styles from "./previewModal.module.scss";

interface PreviewDevModalProps {
  onClose: () => void;
  data: any;
  selectedServices?: any[];
}

export default function PreviewDevModal({
  onClose,
  data,
  selectedServices = [],
}: PreviewDevModalProps) {
  if (!data) return null;

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

    erp:
      data?.erp?.nome ||
      data?.erp_nome ||
      data?.nome_erp ||
      data?.erp ||
      "Não informado",
  };

  /* =========================
     NORMALIZAÇÃO DOS SERVIÇOS
  ========================= */

  const servicos = Array.isArray(selectedServices)
    ? selectedServices.map((service) => {
        // 🔒 Nome do serviço
        const nome =
          service?.nomeServico ||
          service?.nome ||
          service?.descricao ||
          service?.servico?.nome ||
          "Serviço não identificado";

        // 🔒 Descrição
        const descricao =
          service?.descricao ||
          service?.detalhes ||
          "";

        // 🔒 Parâmetros (blindado)
        let parametros: any = null;
        try {
          if (typeof service?.parametros_padrao === "string") {
            parametros = JSON.parse(service.parametros_padrao);
          } else if (typeof service?.parametros_padrao === "object") {
            parametros = service.parametros_padrao;
          }
        } catch {
          parametros = null;
        }

        return {
          id: service?.id ?? Math.random(),
          nome,
          descricao,
          parametros,
        };
      })
    : [];

  /* =========================
     RENDER
  ========================= */

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} id="dev-preview">
        <div className={styles.header}>
          <h2>PRÉVIA - REGISTRO DE DESENVOLVEDORES</h2>
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
              <div key={service.id} className={styles.serviceBox}>
                <h4>✓ {service.nome}</h4>

                {service.descricao && (
                  <p><strong>Descrição:</strong> {service.descricao}</p>
                )}

                {service.parametros && (
                  <pre className={styles.codeBlock}>
                    {JSON.stringify(service.parametros, null, 2)}
                  </pre>
                )}
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
