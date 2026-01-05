"use client";

import { useState } from "react";
import styles from "./modal.module.scss";
import Button from "@/components/ui/button/Button";
import { api } from "@/services/api";

interface EditServiceModalProps {
  servico: any;
  onClose: () => void;
  onUpdated: () => void;
}

/* ===============================
   REMOVE UNDEFINED
=============================== */
function cleanUndefined(obj: Record<string, any>) {
  Object.keys(obj).forEach(
    (key) => obj[key] === undefined && delete obj[key]
  );
  return obj;
}

export default function EditServiceModal({
  servico,
  onClose,
  onUpdated,
}: EditServiceModalProps) {
  const [form, setForm] = useState({
    nomeServico:
      typeof servico?.nomeServico === "string"
        ? servico.nomeServico
        : servico?.nomeServico?.nome ?? "",

    descricao: servico?.descricao ?? "",
    instrucoes: servico?.instrucoes ?? "",
    endpoint: servico?.endpoint ?? "",
    parametros: JSON.stringify(servico?.parametros_padrao ?? {}, null, 2),

    exige_contrato: !!servico?.exige_contrato,
    exige_cpf_cnpj: !!servico?.exige_cpf_cnpj,
    exige_login_ativo: !!servico?.exige_login_ativo,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit() {
    if (!form.nomeServico.trim()) {
      alert("O nome do serviço é obrigatório.");
      return;
    }

    let parametros_padrao: any = null;

    try {
      parametros_padrao =
        form.parametros.trim() === ""
          ? null
          : JSON.parse(form.parametros);
    } catch {
      alert("JSON dos parâmetros é inválido!");
      return;
    }

    const payload = cleanUndefined({
      nomeServico: String(form.nomeServico).trim(),
      descricao: form.descricao.trim() || null,
      instrucoes: form.instrucoes.trim() || null,
      endpoint: form.endpoint.trim() || null,
      parametros_padrao,
      exige_contrato: form.exige_contrato,
      exige_cpf_cnpj: form.exige_cpf_cnpj,
      exige_login_ativo: form.exige_login_ativo,
    });

    try {
      await api.put(`/servico/${servico.id}`, payload);
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      alert("Erro ao atualizar serviço");
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Editar serviço</h2>

        <label className={styles.label}>Nome do serviço</label>
        <input
          className={styles.input}
          name="nomeServico"
          value={form.nomeServico}
          onChange={handleChange}
        />

        <label className={styles.label}>Descrição</label>
        <textarea
          className={styles.textarea}
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
        />

        <label className={styles.label}>Instruções</label>
        <textarea
          className={styles.textarea}
          name="instrucoes"
          value={form.instrucoes}
          onChange={handleChange}
        />

        <label className={styles.label}>Endpoint</label>
        <input
          className={styles.input}
          name="endpoint"
          value={form.endpoint}
          onChange={handleChange}
        />

        <label className={styles.label}>Parâmetros (JSON)</label>
        <textarea
          className={styles.textarea}
          name="parametros"
          value={form.parametros}
          onChange={handleChange}
        />

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
