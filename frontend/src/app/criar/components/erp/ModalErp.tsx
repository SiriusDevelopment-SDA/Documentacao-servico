"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/services/api";
import styles from "./styles.module.scss";
import Button from "../../../../components/ui/button/Button";
import Link from "next/link";

interface Erp {
  id: string;
  nome: string;
  ativo: boolean;
}

interface Sistema {
  id: number;
  nome: string;
}

interface ModalERPProps {
  open: boolean;
  onClose: () => void;
  documentacaoId: string | null;
  onSelectERP: (selectedErpId: string) => void;
}

export default function ModalERP({
  open,
  onClose,
  documentacaoId,
  onSelectERP,
}: ModalERPProps) {
  const [erps, setErps] = useState<Erp[]>([]);
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [sistemasSelecionados, setSistemasSelecionados] = useState<number[]>([]);
  const [selectedERP, setSelectedERP] = useState<Erp | null>(null);
  const [creatingERP, setCreatingERP] = useState(false);
  const [newErpName, setNewErpName] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!open) return;

    api.get("/erp").then(res => setErps(res.data));
    api.get("/sistema").then(res => setSistemas(res.data));
  }, [open]);

  /* ================= CLOSE DROPDOWN ON OUTSIDE CLICK ================= */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= ACTIONS ================= */

  const toggleSistema = (id: number) => {
    setSistemasSelecionados(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleAddERP = async () => {
    if (!newErpName.trim() || sistemasSelecionados.length === 0) {
      alert("Informe o nome do ERP e selecione ao menos um sistema.");
      return;
    }

    const res = await api.post("/erp", {
      nome: newErpName,
      sistemas: sistemasSelecionados,
    });

    setErps(prev => [...prev, res.data]);
    setNewErpName("");
    setSistemasSelecionados([]);
    setCreatingERP(false);
  };

  const handleDeleteERP = async () => {
    if (!selectedERP) return;

    await api.delete(`/erp/${selectedERP.id}`);
    setErps(prev => prev.filter(e => e.id !== selectedERP.id));
    setSelectedERP(null);
  };

  if (!open) return null;

  /* ================= RENDER ================= */

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✖</button>

        <h2>Seleção de ERP</h2>
        <hr />

        {/* LISTA DE ERPS */}
        <div className={styles.erpContainer}>
          {erps.map(erp => (
            <div
              key={erp.id}
              className={`${styles.erpCard} ${
                selectedERP?.id === erp.id ? styles.selected : ""
              }`}
              onClick={() => {
                setSelectedERP(erp);
                onSelectERP(erp.id);
              }}
            >
              <span>{erp.nome}</span>
              <span className={styles.badge}>ATIVO</span>
            </div>
          ))}
        </div>

        {/* AÇÕES */}
        <div className={styles.actionButtons}>
          <Button variant="primary" onClick={() => setCreatingERP(true)}>
            + Adicionar Novo ERP
          </Button>

          <Button
            variant="danger"
            onClick={handleDeleteERP}
            disabled={!selectedERP}
          >
            Excluir ERP
          </Button>

          {selectedERP && (
            <div className={styles.manageSection}>
              <Link href={`/criar/servicos/${documentacaoId}/${selectedERP.id}`}>
                <Button variant="secondary">Gerenciar Serviços</Button>
              </Link>
            </div>
          )}
        </div>

        {/* FORM NOVO ERP */}
        {creatingERP && (
          <div className={styles.newErpForm}>
            <input
              className={styles.input}
              placeholder="Nome do ERP"
              value={newErpName}
              onChange={e => setNewErpName(e.target.value)}
            />

            {/* 🔥 SELECT MODERNO */}
            <div
              className={styles.systemSelect}
              ref={selectRef}
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              <div className={styles.selectedSystems}>
                {sistemasSelecionados.length === 0 && (
                  <span className={styles.placeholder}>
                    Selecione os sistemas
                  </span>
                )}

                {sistemasSelecionados.map(id => {
                  const sistema = sistemas.find(s => s.id === id);
                  if (!sistema) return null;

                  return (
                    <span key={id} className={styles.chip}>
                      {sistema.nome}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleSistema(id);
                        }}
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>

              {openDropdown && (
                <div className={styles.dropdown}>
                  {sistemas.map(s => {
                    const selected = sistemasSelecionados.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        className={`${styles.option} ${
                          selected ? styles.optionSelected : ""
                        }`}
                        onClick={e => {
                          e.stopPropagation();
                          toggleSistema(s.id);
                        }}
                      >
                        {s.nome}
                        {selected && <span>✔</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Button variant="primary" onClick={handleAddERP}>
              Salvar
            </Button>
            <Button variant="danger" onClick={() => setCreatingERP(false)}>
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
