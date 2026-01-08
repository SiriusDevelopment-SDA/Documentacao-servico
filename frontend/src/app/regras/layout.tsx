import type { ReactNode } from "react";
import Navbar from "./components/Navbar";

export default function RegrasLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
