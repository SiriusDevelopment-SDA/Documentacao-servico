"use client";

import styles from "./detalhes.module.scss";

type Props = {
  regra: any;
};
3
export default function DetalhesRegra({ regra }: Props) {
  return (
    <div className={styles.container}>
      {/* Cabeçalho */}
      <div className={styles.header}>
        <h2 className={styles.title}>{regra.descricao}</h2>
        <div className={styles.meta}>
          <p><span>ERP:</span> {regra.erp?.nome || "-"}</p>
          <p><span>Empresa:</span> {regra.empresas?.map((e: any) => e.empresa?.nome).join(", ")}</p>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* SETORES */}
      {regra.setores?.map((setor: any) => (
        <div key={setor.id} className={styles.setorBlock}>
          <h3 className={styles.setorTitle}>{setor.nome}</h3>

          {/* PADRÕES */}
          <div className={styles.tableWrapper}>
            <h4 className={styles.tableTitle}>Parâmetros Padronizados</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ativo</th>
                </tr>
              </thead>
              <tbody>
                {setor.padroes.length > 0 ? (
                  setor.padroes.map((p: any) => (
                    <tr key={p.id}>
                      <td>{p.padrao.nome}</td>
                      <td>{p.padrao.ativo ? "Sim" : "Não"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2}>Nenhum padrão associado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* NECESSÁRIOS */}
          <div className={styles.tableWrapper}>
            <h4 className={styles.tableTitle}>Parâmetros Necessários</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ativo</th>
                </tr>
              </thead>
              <tbody>
                {setor.necessarios.length > 0 ? (
                  setor.necessarios.map((n: any) => (
                    <tr key={n.id}>
                      <td>{n.necessario.nome}</td>
                      <td>{n.necessario.ativo ? "Sim" : "Não"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2}>Nenhum necessário associado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <hr className={styles.divider} />
        </div>
      ))}
    </div>
  );
}
