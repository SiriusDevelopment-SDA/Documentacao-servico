"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

type UltimaRegra = {
  id: number;
  descricao: string;
  createdAt: string;
  erp?: { id: number; nome: string };
};

type UltimaEmpresa = {
  id: number;
  nome: string;
  createdAt: string;
  erp?: { id: number; nome: string };
};

type UltimoData = {
  ultimaRegra?: UltimaRegra | null;
  ultimaEmpresa?: UltimaEmpresa | null;
};

// ✅ Normaliza base e evita duplicar /api (caso env já venha com /api)
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.coraxy.com.br").replace(
  /\/+$/,
  ""
);

const API_URL = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;

export default function RegrasPage() {
  const [data, setData] = useState<UltimoData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [regraRes, empresaRes] = await Promise.all([
          fetch(`${API_URL}/regras/ultima`, { signal: controller.signal }),
          fetch(`${API_URL}/empresas/last`, { signal: controller.signal }),
        ]);

        if (!regraRes.ok) throw new Error(`Erro ao buscar última regra: ${regraRes.status}`);
        if (!empresaRes.ok) throw new Error(`Erro ao buscar última empresa: ${empresaRes.status}`);

        const [ultimaRegra, ultimaEmpresa] = await Promise.all([regraRes.json(), empresaRes.json()]);

        setData({
          ultimaRegra: ultimaRegra ?? null,
          ultimaEmpresa: ultimaEmpresa ?? null,
        });
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          setError(err?.message || "Erro inesperado ao carregar dados.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Última Regra de Negócio</h2>

        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p>{error}</p>
        ) : data.ultimaRegra ? (
          <>
            <p>
              <b>Nome:</b> {data.ultimaRegra.descricao}
            </p>
            <p>
              <b>ERP:</b> {data.ultimaRegra.erp?.nome ?? "-"}
            </p>
            <p>
              <b>Data:</b> {formatDate(data.ultimaRegra.createdAt)}
            </p>
          </>
        ) : (
          <p>Nenhuma regra encontrada</p>
        )}
      </div>

      <div className={styles.card}>
        <h2>Última Empresa</h2>

        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p>{error}</p>
        ) : data.ultimaEmpresa ? (
          <>
            <p>
              <b>Nome:</b> {data.ultimaEmpresa.nome}
            </p>
            <p>
              <b>ERP:</b> {data.ultimaEmpresa.erp?.nome ?? "-"}
            </p>
            <p>
              <b>Data:</b> {formatDate(data.ultimaEmpresa.createdAt)}
            </p>
          </>
        ) : (
          <p>Nenhuma empresa encontrada</p>
        )}
      </div>
    </div>
  );
}
