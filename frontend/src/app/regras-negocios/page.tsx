"use client";

import TabelaRegras from "./components/tabela/TabelaRegras";
import styles from "./styles.module.scss";

export default function RegrasProntasPage() {
  return (
    <div className={styles.backgroundGradient}>
      <div className={styles.container}>
        <h1 className={styles.title}>Regras Prontas</h1>

        <TabelaRegras />
      </div>
    </div>
  );
}
