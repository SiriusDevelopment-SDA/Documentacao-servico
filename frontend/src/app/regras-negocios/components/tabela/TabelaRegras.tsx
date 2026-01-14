"use client";

import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";

import DetalhesRegra from "../modal/DetalhesModal";
import styles from "./tabela.module.scss";

const SETORES_MOCK = [
  { label: "Comercial", value: "Comercial" },
  { label: "Financeiro", value: "Financeiro" },
  { label: "Suporte", value: "Suporte" },
];

export default function TabelaRegras() {
  const [regras, setRegras] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);

  const [selectedRegra, setSelectedRegra] = useState<any>(null);

  // Opções para dropdowns (carregadas por ERP)
  const [padroesOptions, setPadroesOptions] = useState<any[]>([]);
  const [necessariosOptions, setNecessariosOptions] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(false);

  // Mini-form para adicionar novos parâmetros (SETOR via MOCK)
  const [novoSetorNome, setNovoSetorNome] = useState<string | null>(null);
  const [novoPadraoId, setNovoPadraoId] = useState<number | null>(null);
  const [novoNecessarioId, setNovoNecessarioId] = useState<number | null>(null);

  const API_URL = "https://api.coraxy.com.br/api";

  const fetchRegras = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/regras`);
      const data = await res.json();

      const formatted = data.map((r: any) => ({
        id: r.id,
        descricao: r.descricao,
        ativa: r.ativa,
        empresa: r.empresas?.length ? r.empresas[0].empresa?.nome : "-",
        erpNome: r.erp?.nome || "-",
        raw: r,
      }));

      setRegras(formatted);
    } catch (err) {
      console.error("Erro ao buscar regras:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegras();
  }, []);

  const statusTemplate = (rowData: any) => (
    <Tag
      value={rowData.ativa ? "Ativo" : "Inativo"}
      severity={rowData.ativa ? "success" : "danger"}
    />
  );

  const detalhesTemplate = (row: any) => (
    <Button
      label="Detalhes"
      size="small"
      onClick={() => {
        setSelectedRegra(row.raw);
        setDetailsVisible(true);
      }}
    />
  );

  // ====== CHAMADAS DE API (você disse que estão corretas) ======
  const fetchPadroes = async (erpId: number) => {
    const res = await fetch(`${API_URL}/parametros`);
    return res.json();
  };

  const fetchNecessarios = async (erpId: number) => {
    const res = await fetch(`${API_URL}/parametrosnecessarios`);
    return res.json();
  };

  const loadOptions = async (erpId: number) => {
    try {
      setLoadingOptions(true);

      const [padroes, necessarios] = await Promise.all([
        fetchPadroes(erpId),
        fetchNecessarios(erpId),
      ]);

      // Normaliza para arrays
      setPadroesOptions(Array.isArray(padroes) ? padroes : padroes?.data ?? []);
      setNecessariosOptions(
        Array.isArray(necessarios) ? necessarios : necessarios?.data ?? []
      );
    } catch (e) {
      console.error("Erro ao carregar opções de parâmetros:", e);
      setPadroesOptions([]);
      setNecessariosOptions([]);
    } finally {
      setLoadingOptions(false);
    }
  };

  const editTemplate = (row: any) => (
    <Button
      label="Editar"
      size="small"
      severity="secondary"
      onClick={async () => {
        const clone = structuredClone(row.raw);

        const erpId = Number(clone?.erpId ?? clone?.erp?.id);
        if (erpId) {
          await loadOptions(erpId);
        } else {
          setPadroesOptions([]);
          setNecessariosOptions([]);
        }

        // reset mini-form
        setNovoSetorNome(null);
        setNovoPadraoId(null);
        setNovoNecessarioId(null);

        setSelectedRegra(clone);
        setEditVisible(true);
      }}
    />
  );

  const deleteTemplate = (row: any) => (
    <Button
      label="Excluir"
      size="small"
      severity="danger"
      onClick={() => handleDelete(row.id)}
    />
  );

  const handleDelete = (id: number) => {
    confirmDialog({
      message: `Deseja realmente excluir a regra ${id}?`,
      header: "Confirmar exclusão",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: async () => {
        await fetch(`${API_URL}/regras/delete/${id}`, { method: "DELETE" });
        fetchRegras();
      },
    });
  };

  // ====== Adiciona novos parâmetros (SETOR via MOCK) ======
  // Regras:
  // - se o setor escolhido (mock) não existir na regra, cria um setor no state
  // - adiciona o padronizado e necessário selecionados nesse setor
  const adicionarParametrosNoSetor = () => {
    if (!selectedRegra) return;
    if (!novoSetorNome || !novoPadraoId || !novoNecessarioId) return;

    const clone = structuredClone(selectedRegra);
    clone.setores = Array.isArray(clone.setores) ? clone.setores : [];

    const setorNomeNorm = novoSetorNome.trim().toLowerCase();

    let setorIndex = clone.setores.findIndex(
      (s: any) => String(s?.nome ?? "").trim().toLowerCase() === setorNomeNorm
    );

    // Se o setor não existe na regra, cria localmente (para salvar no PUT)
    if (setorIndex === -1) {
      clone.setores.push({
        id: `tmp-${setorNomeNorm}`, // id temporário (string)
        nome: novoSetorNome,
        padroes: [],
        necessarios: [],
      });
      setorIndex = clone.setores.length - 1;
    }

    const setor = clone.setores[setorIndex];

    // --- PADRÃO ---
    setor.padroes = Array.isArray(setor.padroes) ? setor.padroes : [];
    const jaTemPadrao = setor.padroes.some(
      (p: any) => Number(p?.padrao?.id) === Number(novoPadraoId)
    );

    if (!jaTemPadrao) {
      const escolhido = padroesOptions.find(
        (x: any) => Number(x.id) === Number(novoPadraoId)
      );

      setor.padroes.push({
        __key: `padrao-${Date.now()}-${Math.random()}`,
        padrao: escolhido ?? { id: novoPadraoId, nome: String(novoPadraoId) },
      });
    }

    // --- NECESSÁRIO ---
    setor.necessarios = Array.isArray(setor.necessarios) ? setor.necessarios : [];
    const jaTemNecessario = setor.necessarios.some(
      (n: any) => Number(n?.necessario?.id) === Number(novoNecessarioId)
    );

    if (!jaTemNecessario) {
      const escolhido = necessariosOptions.find(
        (x: any) => Number(x.id) === Number(novoNecessarioId)
      );

      setor.necessarios.push({
        __key: `necessario-${Date.now()}-${Math.random()}`,
        necessario:
          escolhido ?? { id: novoNecessarioId, nome: String(novoNecessarioId) },
      });
    }

    setSelectedRegra(clone);

    // reseta padrão e necessário (mantém setor selecionado)
    setNovoPadraoId(null);
    setNovoNecessarioId(null);
  };

  // ====== Salvar (payload com arrays de IDs) ======
  // IMPORTANTE:
  // - Setor existente: manda { id: number, nome, padroes: number[], necessarios: number[] }
  // - Setor criado no modal: manda { nome, padroes: number[], necessarios: number[] } (sem id)
  const salvarEdicao = async () => {
    if (!selectedRegra) return;

    const setoresPayload = (selectedRegra.setores ?? []).map((s: any) => {
      const padroes = Array.from(
        new Set(
          (s.padroes ?? [])
            .map((p: any) => Number(p?.padrao?.id))
            .filter((v: number) => Number.isFinite(v))
        )
      );

      const necessarios = Array.from(
        new Set(
          (s.necessarios ?? [])
            .map((n: any) => Number(n?.necessario?.id))
            .filter((v: number) => Number.isFinite(v))
        )
      );

      const idNum = Number(s?.id);
      const temIdValido = Number.isFinite(idNum);

      return {
        ...(temIdValido ? { id: idNum } : {}), // setor novo vai sem id
        nome: s.nome,
        padroes,
        necessarios,
      };
    });

    const payload = {
      descricao: selectedRegra.descricao,
      ativa: selectedRegra.ativa,
      setores: setoresPayload,
    };

    await fetch(`${API_URL}/regras/update/${selectedRegra.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setEditVisible(false);
    fetchRegras();
  };

  if (loading) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <>
      <div className={styles.tableWrapper}>
        <DataTable
          value={regras}
          paginator
          rows={10}
          tableStyle={{ minWidth: "55rem" }}
        >
          <Column field="id" header="ID" style={{ width: "80px" }} />
          <Column field="descricao" header="Descrição" />
          <Column field="empresa" header="Empresa" />
          <Column field="erpNome" header="ERP" />
          <Column
            header="Status"
            body={statusTemplate}
            style={{ width: "120px" }}
          />
          <Column
            header="Detalhes"
            body={detalhesTemplate}
            style={{ width: "120px" }}
          />
          <Column header="Editar" body={editTemplate} style={{ width: "120px" }} />
          <Column
            header="Excluir"
            body={deleteTemplate}
            style={{ width: "120px" }}
          />
        </DataTable>
      </div>

      <Dialog
        header="Detalhes da Regra"
        visible={detailsVisible}
        style={{ width: "70vw" }}
        onHide={() => setDetailsVisible(false)}
      >
        {selectedRegra && <DetalhesRegra regra={selectedRegra} />}
      </Dialog>

      <Dialog
        header="Editar Regra"
        visible={editVisible}
        style={{ width: "60vw" }}
        onHide={() => setEditVisible(false)}
      >
        {selectedRegra && (
          <div className="flex flex-column gap-3">
            <label>Descrição</label>
            <InputText
              className="w-full"
              value={selectedRegra.descricao}
              onChange={(e) =>
                setSelectedRegra({ ...selectedRegra, descricao: e.target.value })
              }
            />

            <label>Status</label>
            <Dropdown
              className="w-full"
              value={selectedRegra.ativa}
              options={[
                { label: "Ativo", value: true },
                { label: "Inativo", value: false },
              ]}
              onChange={(e) =>
                setSelectedRegra({ ...selectedRegra, ativa: e.value })
              }
            />

            <label>ERP</label>
            <InputText
              className="w-full mb-3"
              value={selectedRegra.erp?.nome ?? "-"}
              disabled
            />

            <hr />

            {loadingOptions && (
              <div className="flex align-items-center gap-2">
                <ProgressSpinner style={{ width: "24px", height: "24px" }} />
                <span>Carregando parâmetros...</span>
              </div>
            )}

            {(selectedRegra.setores ?? []).map((setor: any, setorIndex: number) => (
              <div key={setor.id ?? `${setor.nome}-${setorIndex}`}>
                <h3>{setor.nome}</h3>

                <h4>Parâmetros Padronizados</h4>
                {(setor.padroes ?? []).map((p: any, pIndex: number) => (
                  <Dropdown
                    key={p.__key ?? p.id ?? `${setor.nome}-${pIndex}`}
                    className="w-full mt-2"
                    value={p?.padrao?.id}
                    options={padroesOptions}
                    optionLabel="nome"
                    optionValue="id"
                    placeholder={p?.padrao?.nome}
                    onChange={(e) => {
                      const clone = structuredClone(selectedRegra);
                      const escolhido = padroesOptions.find(
                        (x: any) => x.id === e.value
                      );

                      clone.setores[setorIndex].padroes[pIndex].padrao =
                        escolhido ?? { id: e.value, nome: String(e.value) };

                      setSelectedRegra(clone);
                    }}
                  />
                ))}

                <h4 className="mt-4">Parâmetros Necessários</h4>
                {(setor.necessarios ?? []).map((n: any, nIndex: number) => (
                  <Dropdown
                    key={n.__key ?? n.id ?? `${setor.nome}-${nIndex}`}
                    className="w-full mt-2"
                    value={n?.necessario?.id}
                    options={necessariosOptions}
                    optionLabel="nome"
                    optionValue="id"
                    placeholder={n?.necessario?.nome}
                    onChange={(e) => {
                      const clone = structuredClone(selectedRegra);
                      const escolhido = necessariosOptions.find(
                        (x: any) => x.id === e.value
                      );

                      clone.setores[setorIndex].necessarios[nIndex].necessario =
                        escolhido ?? { id: e.value, nome: String(e.value) };

                      setSelectedRegra(clone);
                    }}
                  />
                ))}
              </div>
            ))}

            {/* ====== BLOCO: ADICIONAR PARÂMETROS (SETOR VIA MOCK) ====== */}
            <hr className="my-3" />
            <h3>Adicionar parâmetros</h3>

            <label>Setor</label>
            <Dropdown
              className="w-full"
              value={novoSetorNome}
              options={SETORES_MOCK}
              placeholder="Selecione o setor"
              onChange={(e) => {
                setNovoSetorNome(e.value);
                setNovoPadraoId(null);
                setNovoNecessarioId(null);
              }}
            />

            <label className="mt-2">Parâmetro Padronizado</label>
            <Dropdown
              className="w-full"
              value={novoPadraoId}
              options={padroesOptions}
              optionLabel="nome"
              optionValue="id"
              placeholder="Selecione o parâmetro padronizado"
              disabled={!novoSetorNome}
              onChange={(e) => {
                setNovoPadraoId(e.value);
                setNovoNecessarioId(null);
              }}
            />

            <label className="mt-2">Parâmetro Necessário</label>
            <Dropdown
              className="w-full"
              value={novoNecessarioId}
              options={necessariosOptions}
              optionLabel="nome"
              optionValue="id"
              placeholder="Selecione o parâmetro necessário"
              disabled={!novoSetorNome || !novoPadraoId}
              onChange={(e) => setNovoNecessarioId(e.value)}
            />

            <Button
              label="Adicionar"
              className="mt-3"
              disabled={!novoSetorNome || !novoPadraoId || !novoNecessarioId}
              onClick={adicionarParametrosNoSetor}
            />

            <Button
              label="Salvar"
              onClick={salvarEdicao}
              className="botao-salvar mt-3"
            />
          </div>
        )}
      </Dialog>

      <ConfirmDialog />
    </>
  );
}
