import type { ReactNode } from "react";
import Navbar from "./components/navbar/Navbar";
import "primereact/resources/themes/lara-dark-purple/theme.css"; // tema
import "primereact/resources/primereact.min.css"; // core
import "primeicons/primeicons.css"; // ícones
import "primeflex/primeflex.css";

export default function RegrasNegociosLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
