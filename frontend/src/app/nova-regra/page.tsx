"use client";

import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ToggleButton } from "primereact/togglebutton";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

import styles from "./styles.module.scss";

/* =========================
   INTERFACES
========================= */
interface Empresa {
  id: number;
  nome: string;
}

interface Erp {
  id: number;
  nome: string;
}

interface ParamPadronizado {
  id: number;
  nome: string;
  ativo: boolean;
  erpId: number;
}

interface ParamNecessario {
  id: number;
  nome: string;
}

/* =========================
   COMPONENT
========================= */
export default function NovaRegraPage() {
  const [empresaTexto, setEmpresaTexto] = useState("");
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  const [descricao, setDescricao] = useState("");
  const [erp, setErp] = useState<Erp | null>(null);
  const [erps, setErps] = useState<Erp[]>([]);
  const [status, setStatus] = useState(true);

  const [setoresSelecionados, setSetoresSelecionados] = useState<string[]>([]);
  const setoresMock = ["Comercial", "Financeiro", "Suporte"];

  const [padronizados, setPadronizados] = useState<
    Record<string, { padronizado: ParamPadronizado; necessarios: ParamNecessario[] }[]>
  >({});
  const [padronizadosAPI, setPadronizadosAPI] = useState<ParamPadronizado[]>([]);
  const [necessariosAPI, setNecessariosAPI] = useState<ParamNecessario[]>([]);

  /* =========================
     FETCHES
  ========================= */
  const fetchEmpresas = async () => {
    const res = await fetch("https://api.coraxy.com.br/api/empresa");
    setEmpresas(await res.json());
  };

  const fetchErps = async () => {
    const res = await fetch("https://api.coraxy.com.br/api/erp");
    setErps(await res.json());
  };

  const fetchPadronizados = async (erpId: number) => {
    const res = await fetch(
      `https://api.coraxy.com.br/api/parametros?erpId=${erpId}`
    );
    const data = await res.json();
    setPadronizadosAPI(Array.isArray(data) ? data : []);
  };

  const fetchNecessarios = async (erpId: number) => {
    const res = await fetch(
      `https://api.coraxy.com.br/api/parametrosnecessarios?erpId=${erpId}`
    );
    const data = await res.json();
    setNecessariosAPI(Array.isArray(data) ? data : []);
  };

  /* =========================
     EFFECTS
  ========================= */
  useEffect(() => {
    fetchEmpresas();
    fetchErps();
  }, []);

  useEffect(() => {
    if (erp?.id) {
      fetchPadronizados(erp.id);
      fetchNecessarios(erp.id);

      // limpa seleções antigas ao trocar ERP
      setPadronizados({});
    } else {
      setPadronizadosAPI([]);
      setNecessariosAPI([]);
      setPadronizados({});
    }
  }, [erp]);

  /* =========================
     HANDLERS
  ========================= */
  const adicionarPadronizado = (setor: string, pad: ParamPadronizado) => {
    setPadronizados(prev => {
      const lista = prev[setor] || [];
      if (lista.some(item => item.padronizado.id === pad.id)) return prev;

      return {
        ...prev,
        [setor]: [...lista, { padronizado: pad, necessarios: [] }]
      };
    });
  };

  const adicionarNecessario = (setor: string, index: number, nec: ParamNecessario) => {
    setPadronizados(prev => {
      const copia = [...prev[setor]];
      if (!copia[index].necessarios.some(x => x.id === nec.id)) {
        copia[index].necessarios.push(nec);
      }
      return { ...prev, [setor]: copia };
    });
  };

  const removerSetor = (setor: string) => {
    setSetoresSelecionados(prev => prev.filter(s => s !== setor));
    const copia = { ...padronizados };
    delete copia[setor];
    setPadronizados(copia);
  };

  const removerPadronizado = (setor: string, index: number) => {
    setPadronizados(prev => {
      const copia = [...prev[setor]];
      copia.splice(index, 1);
      return { ...prev, [setor]: copia };
    });
  };

  const removerNecessario = (setor: string, index: number, necId: number) => {
    setPadronizados(prev => {
      const copia = [...prev[setor]];
      copia[index].necessarios = copia[index].necessarios.filter(n => n.id !== necId);
      return { ...prev, [setor]: copia };
    });
  };

  /* =========================
     SALVAR
  ========================= */
  const salvar = async () => {
    if (!erp) return alert("Selecione um ERP.");
    if (!empresaSelecionada) return alert("Selecione uma empresa.");

    const setoresPayload = setoresSelecionados.map(setor => ({
      nome: setor,
      padroes: (padronizados[setor] || []).map(p => p.padronizado.id),
    }));

    if (setoresPayload.length === 0) {
      return alert("Adicione ao menos 1 setor e 1 parâmetro padronizado!");
    }

    const payload = {
      empresaId: empresaSelecionada.id,
      erpId: erp.id,
      descricao: descricao.trim() || "Regra automática",
      setores: setoresPayload,
      ativa: status
    };

    const res = await fetch("https://api.coraxy.com.br/api/regras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await res.json();

    if (!res.ok) {
      console.error(json);
      return alert(json.message || "Erro ao salvar regra.");
    }

    alert("Regra salva com sucesso!");
  };

  /* =========================
     JSX
  ========================= */
  return (
    <div className={styles.backgroundGradient}>
      <div className={styles.container}>
        <h2 className={styles.title}>Criar Regra de Negócio</h2>

        {/* INFORMAÇÕES GERAIS */}
        <Card title="Informações Gerais" className={styles.card}>
          <label className={styles.label}>Empresa</label>
          <div className={styles.empresaRow}>
            <InputText
              value={empresaTexto}
              onChange={(e) => setEmpresaTexto(e.target.value)}
              className={styles.input}
              placeholder="Digite o nome da empresa..."
            />
            <Dropdown
              value={empresaSelecionada}
              options={empresas}
              onChange={(e) => setEmpresaSelecionada(e.value)}
              optionLabel="nome"
              placeholder="Selecionar do banco"
              className={styles.input}
            />
          </div>

          <label className={styles.label}>Descrição</label>
          <InputText
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className={styles.input}
            placeholder="Opcional"
          />

          <label className={styles.label}>ERP</label>
          <Dropdown
            value={erp}
            options={erps}
            onChange={(e) => setErp(e.value)}
            optionLabel="nome"
            placeholder="Selecione um ERP"
            className={styles.input}
          />

          <ToggleButton
            onLabel="Ativa"
            offLabel="Inativa"
            checked={status}
            onChange={(e) => setStatus(e.value)}
            className={styles.toggle}
          />
        </Card>

        {/* SETORES */}
        <Card title="Setores" className={styles.card}>
          <div className={styles.setorRow}>
            <Dropdown
              value={null}
              options={setoresMock}
              onChange={(e) =>
                !setoresSelecionados.includes(e.value) &&
                setSetoresSelecionados(prev => [...prev, e.value])
              }
              placeholder="Selecione um setor"
              className={styles.dropdownSelect}
            />
          </div>

          {setoresSelecionados.length === 0 && (
            <p className={styles.emptyText}>Nenhum setor adicionado ainda...</p>
          )}

          <div className={styles.setoresList}>
            {setoresSelecionados.map((setor, i) => (
              <div key={i} className={styles.setorTag}>
                <span>{setor}</span>
                <i className="pi pi-times" onClick={() => removerSetor(setor)} />
              </div>
            ))}
          </div>
        </Card>

        {/* PARÂMETROS */}
        {setoresSelecionados.length > 0 && (
          <Card title="Parâmetros" className={styles.card}>
            {setoresSelecionados.map(setor => (
              <div key={setor} className={styles.paramBlock}>
                <h4 className={styles.paramSetorTitle}>{setor}</h4>

                <Dropdown
                  options={padronizadosAPI}
                  optionLabel="nome"
                  placeholder={erp ? "Selecione um Parâmetro Padronizado" : "Selecione um ERP primeiro"}
                  disabled={!erp}
                  className={styles.paramDropdown}
                  onChange={(e) => adicionarPadronizado(setor, e.value)}
                />

                {(padronizados[setor] || []).map((item, idx) => (
                  <div key={idx} className={styles.paramCard}>
                    <div className={styles.paramHeader}>
                      <span className={styles.paramTitle}>
                        {item.padronizado.nome}
                      </span>
                      <span
                        className={styles.closeBtn}
                        onClick={() => removerPadronizado(setor, idx)}
                      >
                        ✕
                      </span>
                    </div>

                    <Dropdown
                      options={necessariosAPI}
                      optionLabel="nome"
                      placeholder="Adicionar necessário"
                      className={styles.paramDropdownSmall}
                      onChange={(e) => adicionarNecessario(setor, idx, e.value)}
                    />

                    {item.necessarios.length > 0 && (
                      <table className={styles.tableNecessarios}>
                        <tbody>
                          {item.necessarios.map((n) => (
                            <tr key={n.id}>
                              <td>{n.nome}</td>
                              <td>
                                <span
                                  className={styles.closeBtn}
                                  onClick={() =>
                                    removerNecessario(setor, idx, n.id)
                                  }
                                >
                                  ✕
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </Card>
        )}

        <div className={styles.saveBtnContainer}>
          <Button
            label="Salvar Regra"
            icon="pi pi-check"
            className={styles.btnSave}
            onClick={salvar}
          />
        </div>
      </div>
    </div>
  );
}
