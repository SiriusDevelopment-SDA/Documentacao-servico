"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import styles from "./styles.module.scss";
import Button from "../../../../components/ui/button/Button";
import Link from "next/link";

interface Erp {
  id: string;
  nome: string;
  ativo: boolean;
}

interface ModalERPProps {
  open: boolean;
  onClose: () => void;
  documentacaoId: string | null;
  onSelectERP: (selectedErpId: string) => void; // Função para passar o ERP selecionado
}

export default function ModalERP({ open, onClose, documentacaoId, onSelectERP }: ModalERPProps) {
  const [erps, setErps] = useState<Erp[]>([]);
  const [selectedERP, setSelectedERP] = useState<Erp | null>(null);
  const [creatingERP, setCreatingERP] = useState(false);
  const [newErpName, setNewErpName] = useState("");

  // 🔄 Carregar ERPs
  useEffect(() => {
    if (!open) return;
    if (!documentacaoId) return;

    api.get("/erp")
      .then((res) => setErps(res.data))
      .catch((err) => console.log("Erro ao carregar ERPs:", err));
  }, [open, documentacaoId]);

  // Criar novo ERP 
  const handleAddERP = async () => {
    if (!newErpName.trim()) return;

    try {
      const res = await api.post("/erp", {
        nome: newErpName,
        documentacaoId,
      });

      setErps((prev) => [...prev, res.data]);
      setNewErpName("");
      setCreatingERP(false);
    } catch (err) {
      console.log("Erro ao criar ERP:", err);
    }
  };

  // Excluir ERP
  const handleDeleteERP = async () => {
    if (!selectedERP) return;

    try {
      await api.delete(`/erp/${selectedERP.id}`);
      setErps((prev) => prev.filter((e) => e.id !== selectedERP.id));
      setSelectedERP(null);
    } catch (err) {
      console.log("Erro ao excluir ERP:", err);
    }
  };

  // Função chamada quando o ERP for selecionado
  const handleSelect = (erp: Erp) => {
    setSelectedERP(erp); // Atualiza o ERP selecionado
    onSelectERP(erp.id); // Passa o ERP selecionado para o componente pai
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✖</button>

        <h2>Seleção de ERP</h2>
        <hr />

        <div className={styles.erpContainer}>
          {erps.map((erp) => (
            <div
              key={erp.id}
              className={`${styles.erpCard} ${selectedERP?.id === erp.id ? styles.selected : ""}`}
              onClick={() => handleSelect(erp)} // Chama a função de seleção do ERP
            >
              <span className={styles.erpName}>{erp.nome}</span>
              <span className={styles.badge}>ATIVO</span>
            </div>
          ))}
        </div>

        <div className={styles.actionButtons}>
          <Button
            variant="primary"
            onClick={() => setCreatingERP(true)}
          >
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

        {creatingERP && (
          <div className={styles.newErpForm}>
            <input
              className={styles.input}
              type="text"
              placeholder="Nome do ERP"
              value={newErpName}
              onChange={(e) => setNewErpName(e.target.value)}
            />
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
