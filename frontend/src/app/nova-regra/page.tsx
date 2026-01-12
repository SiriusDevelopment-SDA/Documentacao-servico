"use client";

import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ToggleButton } from "primereact/togglebutton";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

import styles from "./styles.module.scss";

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

export default function NovaRegraPage() {
  // ===================== ESTADOS =====================
  const [empresaTexto, setEmpresaTexto] = useState("");
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  const [descricao, setDescricao] = useState("");
  const [erp, setErp] = useState<Erp | null>(null);
  const [erps, setErps] = useState<Erp[]>([]);
  const [status, setStatus] = useState(true);

  const [setoresSelecionados, setSetoresSelecionados] = useState<string[]>([]);
  const setoresMock = ["Comercial", "Financeiro", "Suporte"];

  const [padronizados, setPadronizados] = useState<Record<string, { padronizado: ParamPadronizado; necessarios: ParamNecessario[] }[]>>({});
  const [padronizadosAPI, setPadronizadosAPI] = useState<ParamPadronizado[]>([]);

  const [necessariosAPI, setNecessariosAPI] = useState<Record<number, ParamNecessario[]>>({});

  // ===================== BUSCAS =====================

  const fetchEmpresas = async () => {
    const res = await fetch("https://api.coraxy.com.br/api/empresa");
    setEmpresas(await res.json());
  };

  const fetchErps = async () => {
    const res = await fetch("https://api.coraxy.com.br/api/erp");
    setErps(await res.json());
  };

  const fetchPadronizados = async () => {
    const res = await fetch("https://api.coraxy.com.br/api/parametros");
    setPadronizadosAPI(await res.json());
  };

  const fetchNecessarios = async (padronizadoId: number) => {
    const res = await fetch("https://api.coraxy.com.br/api/parametrosnecessarios");
    const data = await res.json();
    setNecessariosAPI(prev => ({ ...prev, [padronizadoId]: data }));
  };

  useEffect(() => {
    fetchEmpresas();
    fetchErps();
    fetchPadronizados();
  }, []);

  // ===================== HANDLERS =====================

  const adicionarPadronizado = (setor: string, pad: ParamPadronizado) => {
    fetchNecessarios(pad.id);

    setPadronizados(prev => {
      const lista = prev[setor] || [];
      return {
        ...prev,
        [setor]: [...lista, { padronizado: pad, necessarios: [] }]
      };
    });
  };

  const adicionarNecessario = (setor: string, index: number, nec: ParamNecessario) => {
    setPadronizados(prev => {
      const copia = [...prev[setor]];
      if (!copia[index].necessarios.some((x) => x.id === nec.id)) {
        copia[index].necessarios.push(nec);
      }
      return { ...prev, [setor]: copia };
    });
  };

  const removerSetor = (setor: string) => {
    setSetoresSelecionados(prev => prev.filter((s) => s !== setor));
    const copia = { ...padronizados };
    delete copia[setor];
    setPadronizados(copia);
  };

  const salvar = () => {
    const payload = {
      empresa: empresaSelecionada ? empresaSelecionada.id : empresaTexto.trim(),
      descricao,
      ativa: status,
      erpId: erp?.id,
      setores: setoresSelecionados,
      parametros: padronizados,
    };

    console.log("ENVIAR PRO BACKEND:", payload);
    alert("Regra montada — ver console!");
  };

  return (
    <div className={styles.backgroundGradient}>
      <div className={styles.container}>
        <h2 className={styles.title}>Criar Regra de Negócio</h2>

        {/* ===================== INFORMAÇÕES GERAIS ===================== */}
        <Card title="Informações Gerais" className={styles.card}>
          <label className={styles.label}>Empresa</label>
          <div className={styles.empresaRow}>
            <InputText value={empresaTexto} onChange={(e) => setEmpresaTexto(e.target.value)} className={styles.input} placeholder="Digite o nome da empresa..." />
            <Dropdown value={empresaSelecionada} options={empresas} onChange={(e) => setEmpresaSelecionada(e.value)} optionLabel="nome" placeholder="Selecionar do banco" className={styles.input} />
          </div>

          <label className={styles.label}>Descrição</label>
          <InputText value={descricao} onChange={(e) => setDescricao(e.target.value)} className={styles.input} placeholder="Opcional" />

          <label className={styles.label}>ERP</label>
          <Dropdown value={erp} options={erps} onChange={(e) => setErp(e.value)} optionLabel="nome" placeholder="Selecione um ERP" className={styles.input} />

          <ToggleButton onLabel="Ativa" offLabel="Inativa" checked={status} onChange={(e) => setStatus(e.value)} className={styles.toggle} />
        </Card>

        {/* ===================== SETORES ===================== */}
        <Card title="Setores" className={styles.card}>
          <div className={styles.setorRow}>
            <Dropdown value={null} options={setoresMock} onChange={(e) => !setoresSelecionados.includes(e.value) && setSetoresSelecionados([...setoresSelecionados, e.value])} placeholder="Selecione um setor" className={styles.dropdownSelect} />
          </div>

          {setoresSelecionados.length === 0 && <p className={styles.emptyText}>Nenhum setor adicionado ainda...</p>}

          <div className={styles.setoresList}>
            {setoresSelecionados.map((setor, i) => (
              <div key={i} className={styles.setorTag}>
                <span>{setor}</span>
                <i className="pi pi-times" onClick={() => removerSetor(setor)} />
              </div>
            ))}
          </div>
        </Card>

        {/* ===================== PARÂMETROS ===================== */}
        {setoresSelecionados.length > 0 && (
          <Card title="Parâmetros" className={styles.card}>
            {setoresSelecionados.map((setor) => (
              <div key={setor} className={styles.paramBlock}>
                <h4 className={styles.paramSetorTitle}>{setor}</h4>

                <Dropdown
                  options={padronizadosAPI}
                  optionLabel="nome"
                  placeholder="Selecione um Parâmetro Padronizado"
                  className={styles.paramDropdown}
                  onChange={(e) => adicionarPadronizado(setor, e.value)}
                />

                {(padronizados[setor] || []).map((item, idx) => (
                  <div key={idx} className={styles.paramCard}>
                    <div className={styles.paramHeader}>
                      <span className={styles.paramTitle}>{item.padronizado.nome}</span>
                    </div>

                    <Dropdown
                      options={necessariosAPI[item.padronizado.id] || []}
                      optionLabel="nome"
                      placeholder="Adicionar necessário"
                      className={styles.paramDropdownSmall}
                      onChange={(e) => adicionarNecessario(setor, idx, e.value)}
                    />

                    {item.necessarios.length > 0 && (
                      <table className={styles.tableNecessarios}>
                        <thead>
                          <tr>
                            <th>Necessário</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.necessarios.map((n, k) => (
                            <tr key={k}>
                              <td>{n.nome}</td>
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

        {/* ===================== SALVAR ===================== */}
        <div className={styles.saveBtnContainer}>
          <Button label="Salvar Regra" icon="pi pi-check" className={styles.btnSave} onClick={salvar} />
        </div>
      </div>
    </div>
  );
}
