import styles from './paginaInicial.module.scss'
import OverviewRegs from "./components/OverviewRegs";

export default function PageRegras() {
  return (
    <div style={{ padding: "16px" }}>
      <h1 style={{ color: "#fff", marginBottom: "16px" }}></h1>
      <OverviewRegs />
    </div>
  );
}


