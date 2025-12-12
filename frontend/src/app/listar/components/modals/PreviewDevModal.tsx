"use client";

import styles from "./previewModal.module.scss";

export default function PreviewDevModal({
  onClose,
  data,
  selectedServices,
}: {
  onClose: () => void;
  data: any;
  selectedServices: any[];
}) {
  if (!data) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} id="dev-preview">
        <div className={styles.header}>
          <h2>PRÉVIA - REGISTRO DE DESENVOLVEDORES</h2>
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
            <div key={service.id} className={styles.serviceBox}>
              <h4>✓ {service.nome}</h4>

              {service.descricao && (
                <p><strong>Descrição:</strong> {service.descricao}</p>
              )}

              {service.parametros_padrao && (
                <pre className={styles.codeBlock}>
{JSON.stringify(service.parametros_padrao, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
