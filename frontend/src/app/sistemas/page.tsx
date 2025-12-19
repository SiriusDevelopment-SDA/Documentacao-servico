"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import styles from "./styles.module.scss";
import { api } from "@/services/api";

interface Sistema {
  id: number;
  nome: string;
  logoUrl?: string;
}

export default function SistemasPage() {
  const router = useRouter();
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`/${api}/sistema`)
      .then((res) => res.json())
      .then((data) => setSistemas(data));
  }, []);

  const sistemasFiltrados = sistemas.filter((s) =>
    s.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* 🔙 Seta padrão → volta para Documentação de serviços */}
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
              {sistema.logoUrl && (
                <img
                  src={sistema.logoUrl}
                  alt={sistema.nome}
                  className={styles.logo}
                />
              )}
              <span>{sistema.nome}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
