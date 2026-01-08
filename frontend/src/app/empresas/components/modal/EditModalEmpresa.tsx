"use client";

import React, { useState, useEffect } from "react";
import styles from "./editModal.module.scss";

type Empresa = {
  id: number;
  nome: string;
  cpf_cnpj?: string;
  erpId: number;
};

type Erp = {
  id: number;
  nome: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  empresa: Empresa | null;
  erps: Erp[];
  onSave: (empresaAtualizada: Empresa) => void;
};

export default function EmpresaModal({ open, onClose, empresa, erps, onSave }: Props) {
  const [nome, setNome] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [erpId, setErpId] = useState("");

  useEffect(() => {
    if (empresa) {
      setNome(empresa.nome);
      setCpfCnpj(empresa.cpf_cnpj ?? "");
      setErpId(String(empresa.erpId));
    }
  }, [empresa]);

  if (!open || !empresa) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      id: empresa.id,
      nome,
      cpf_cnpj: cpfCnpj,
      erpId: Number(erpId),
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Editar Empresa</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Nome da empresa"
          />

          <input
            className={styles.input}
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value)}
            placeholder="CPF/CNPJ"
          />

          <select
            className={styles.input}
            value={erpId}
            onChange={(e) => setErpId(e.target.value)}
            required
          >
            <option value="" disabled>Selecione um ERP</option>
            {erps.map((erp) => (
              <option key={erp.id} value={erp.id}>
                {erp.nome}
              </option>
            ))}
          </select>

          <div className={styles.buttons}>
            <button type="button" onClick={onClose} className={styles.cancel}>
              Cancelar
            </button>
            <button type="submit" className={styles.save}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
