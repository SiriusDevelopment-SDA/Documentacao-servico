"use client";

import styles from "./previewModal.module.scss";

export default function PreviewContractModal({
  onClose,
  data,
  selectedServices
}: {
  onClose: () => void;
  data: any;
  selectedServices: any[];
}) {
  if (!data) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} id="contract-preview">
        <div className={styles.header}>
          <h2>PRÉVIA - CONTRATO DE SERVIÇOS</h2>
          <button className={styles.closeBtn} onClick={onClose}>X</button>
        </div>

        <div className={styles.section}>
          <h3>DADOS DO CONTRATO</h3>

          <p><strong>Nome da empresa:</strong> {data.nome_empresa ?? "Não informado"}</p>
          <p><strong>Nome do Contratante:</strong> {data.nome_contratante}</p>
          <p><strong>Documentado por:</strong> {data.documentado_por}</p>
          <p><strong>Data:</strong> {data.data}</p>
          <p><strong>ERP Selecionado:</strong> {data.erp}</p>
          <p><strong>Número do Contrato:</strong> {data.numero_contrato}</p>
        </div>

        <div className={styles.section}>
          <h3>SERVIÇOS SELECIONADOS COM CONFIGURAÇÕES</h3>

          {selectedServices.map((service) => (
            <div key={service.id} className={styles.contractService}>
              ✓ {service.nome}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
