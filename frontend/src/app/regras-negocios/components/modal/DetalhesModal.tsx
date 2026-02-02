"use client";

import styles from "./detalhes.module.scss";

type Props = {
  regra: any;
};

export default function DetalhesRegra({ regra }: Props) {
  return (
    <div className={styles.container}>
      {/* Cabeçalho */}
      <div className={styles.header}>
        <h2 className={styles.title}>{regra.descricao}</h2>

        <div className={styles.meta}>
          <p>
            <span>ERP:</span> {regra.erp?.nome || "-"}
          </p>
          <p>
            <span>Empresa:</span>{" "}
            {regra.empresas?.map((e: any) => e.empresa?.nome).join(", ")}
          </p>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* SETORES */}
      {regra.setores?.map((setor: any) => (
        <div key={setor.id} className={styles.setorBlock}>
          <h3 className={styles.setorTitle}>{setor.nome}</h3>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th>Ativo</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(setor.padroes) && setor.padroes.length > 0 ? (
                  setor.padroes.map((p: any) => (
                    <>
                      {/* Linha do serviço */}
                      <tr key={`padrao-${p.id}`}>
                        <td>{p.padrao?.nome}</td>
                        <td>{p.padrao?.ativo ? "Sim" : "Não"}</td>
                      </tr>

                      {/* Parâmetros necessários DO SERVIÇO */}
                      {Array.isArray(p.padrao?.parametrosNecessarios) &&
                        p.padrao.parametrosNecessarios.length > 0 && (
                          <>
                            <tr className={styles.subTitle}>
                              <td colSpan={2}>
                                Parâmetros necessários para{" "}
                                <strong>{p.padrao.nome}</strong>
                              </td>
                            </tr>

                            {p.padrao.parametrosNecessarios.map((n: any) => (
                              <tr
                                key={`necessario-${n.id}`}
                                className={styles.rowNecessario}
                              >
                                <td>
                                  • {n.parametroNecessario?.nome}
                                </td>
                                <td>
                                  {n.obrigatorio ? "Obrigatório" : "Opcional"}
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                    </>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2}>Nenhum serviço configurado</td>
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
