"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { GridLegacy as Grid } from "@mui/material";
import KpiCard from "./cards/KpiCard";

export default function OverviewRegs() {
  const [ultimaRegra, setUltimaRegra] = useState<string | null>(null);
  const [ultimaEmpresa, setUltimaEmpresa] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const regra = await axios.get("https://api.coraxy.com.br/regras/ultima");
        const empresa = await axios.get("https://api.coraxy.com.br/empresas/ultima");
        setUltimaRegra(regra.data?.nome ?? null);
        setUltimaEmpresa(empresa.data?.nome ?? null);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    }
    load();
  }, []);

  return (
    <Grid container spacing={3} mt={2}>
      <Grid item xs={12} md={6}>
        <KpiCard
          title="Última Regra Criada"
          value={ultimaRegra ?? "Nenhuma regra cadastrada"}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <KpiCard
          title="Última Empresa Criada"
          value={ultimaEmpresa ?? "Nenhuma empresa cadastrada"}
        />
      </Grid>
    </Grid>
  );
}
