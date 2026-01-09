import type { ReactNode } from "react";
import Navbar from "./components/navbar/Navbar";

export default function ParametrosNecessariosLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
