import type { ReactNode } from "react";
import Navbar from "./components/navbar/Navbar";

export default function EmpresasLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
