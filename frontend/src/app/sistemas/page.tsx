"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import styles from "./styles.module.scss";
import { api } from "@/services/api";

interface Sistema {
  id: number;
  nome: string;
  logoUrl?: string; // deve vir como: /uploads/unifica.png
}

export default function SistemasPage() {
  const router = useRouter();
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/sistema")
      .then((response) => {
        setSistemas(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar sistemas:", error);
      });
  }, []);

  const sistemasFiltrados = sistemas.filter((s) =>
    s.nome.toLowerCase().includes(search.toLowerCase())
  );

  const getLogoUrl = (logoUrl?: string) => {
    if (!logoUrl) return "/system-default.png";
    return `${process.env.NEXT_PUBLIC_API_URL}${logoUrl}`;
  };

  return (
    <div className={styles.container}>
      {/* 🔙 Voltar */}
      <button
        className={styles.backButton}
        onClick={() => router.push("/")}
        title="Voltar para Documentação de serviços"
      >
        <ArrowLeftIcon />
      </button>

      <div className={styles.content}>
        <h1 className={styles.title}>Escolha um sistema para continuar</h1>

        <input
          className={styles.search}
          placeholder="Buscar sistema..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Cards */}
        <div className={styles.systemsGrid}>
          {sistemasFiltrados.map((sistema) => (
            <button
              key={sistema.id}
              className={styles.systemCard}
              onClick={() => router.push(`/sistemas/${sistema.id}`)}
            >
              <img
                src={getLogoUrl(sistema.logoUrl)}
                alt={sistema.nome}
                className={styles.logo}
                onError={(e) => {
                  e.currentTarget.src = "/system-default.png";
                }}
              />

              <span>{sistema.nome}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
