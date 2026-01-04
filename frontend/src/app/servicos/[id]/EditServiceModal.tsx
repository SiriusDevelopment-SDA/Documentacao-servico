"use client";

import { useState } from "react";
import styles from "./modal.module.scss";
import Button from "@/components/ui/button/Button";
import { api } from "@/services/api";

/* ===============================
   TIPAGENS
================================ */

interface NomeServico {
  id: number;
  nome: string;
}

interface Servico {
  id: number;
  descricao: string;
  instrucoes: string;
  endpoint: string;
  parametros_padrao?: any;

  exige_contrato: boolean;
  exige_cpf_cnpj: boolean;
  exige_login_ativo: boolean;

  nomeServico?: NomeServico;
}

interface EditServiceModalProps {
  servico: Servico;
  onClose: () => void;
  onUpdated: () => void;
}

/* ===============================
   COMPONENT
================================ */

export default function EditServiceModal({
  servico,
  onClose,
  onUpdated,
}: EditServiceModalProps) {
  const [form, setForm] = useState({
    descricao: servico.descricao || "",
    instrucoes: servico.instrucoes || "",
    endpoint: servico.endpoint || "",
    parametros_padrao: JSON.stringify(
      servico.parametros_padrao || {},
      null,
      2
    ),
    exige_contrato: !!servico.exige_contrato,
    exige_cpf_cnpj: !!servico.exige_cpf_cnpj,
    exige_login_ativo: !!servico.exige_login_ativo,
  });

  /* ===============================
     CHANGE HANDLER
  ================================ */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (target as HTMLInputElement).checked
          : value,
    }));
  }

  /* ===============================
     SUBMIT
  ================================ */
  async function handleSubmit() {
    let jsonParams = null;

    if (form.parametros_padrao.trim() !== "") {
      try {
        jsonParams = JSON.parse(form.parametros_padrao);
      } catch {
        alert("JSON dos parâmetros é inválido!");
        return;
      }
    }

    try {
      await api.put(`/servico/${servico.id}`, {
        nomeServicoId: servico.nomeServico?.id, // 🔑 ESSENCIAL
        descricao: form.descricao,
        instrucoes: form.instrucoes,
        endpoint: form.endpoint,
        parametros_padrao: jsonParams,
        exige_contrato: form.exige_contrato,
        exige_cpf_cnpj: form.exige_cpf_cnpj,
        exige_login_ativo: form.exige_login_ativo,
      });


      onUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar serviço");
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Editar serviço</h2>

        {/* 🏷️ NOME (READ ONLY) */}
        <label className={styles.label}>Nome</label>
        <input
          className={styles.input}
          value={servico.nomeServico?.nome || "Serviço sem nome"}
          disabled
        />

        {/* 📝 DESCRIÇÃO */}
        <label className={styles.label}>Descrição</label>
        <textarea
          className={styles.textarea}
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
        />

        {/* 📌 INSTRUÇÕES */}
        <label className={styles.label}>Instruções</label>
        <textarea
          className={styles.textarea}
          name="instrucoes"
          value={form.instrucoes}
          onChange={handleChange}
        />

        {/* 🌐 ENDPOINT */}
        <label className={styles.label}>Endpoint</label>
        <input
          className={styles.input}
          name="endpoint"
          value={form.endpoint}
          onChange={handleChange}
        />

        {/* 🧩 JSON */}
        <label className={styles.label}>Parâmetros (JSON)</label>
        <textarea
          className={styles.textarea}
          name="parametros_padrao"
          value={form.parametros_padrao}
          onChange={handleChange}
        />

        {/* ☑️ CHECKBOXES */}
        <div className={styles.checkboxRow}>
          <label className={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="exige_contrato"
              checked={form.exige_contrato}
              onChange={handleChange}
            />
            Exige contrato
          </label>

          <label className={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="exige_cpf_cnpj"
              checked={form.exige_cpf_cnpj}
              onChange={handleChange}
            />
            Exige CPF/CNPJ
          </label>

          <label className={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="exige_login_ativo"
              checked={form.exige_login_ativo}
              onChange={handleChange}
            />
            Exige login ativo
          </label>
        </div>

        {/* 🔘 AÇÕES */}
        <div className={styles.actions}>
          <Button variant="danger" onClick={onClose}>
            Cancelar
          </Button>

          <Button variant="primary" onClick={handleSubmit}>
            Salvar alterações
          </Button>
        </div>
      </div>
    </div>
  );
}
