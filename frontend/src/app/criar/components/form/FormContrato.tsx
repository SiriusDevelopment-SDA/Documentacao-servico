"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import styles from "./styles.module.scss";
import Button from "../../../../components/ui/button/Button"


interface FormContratoProps {
  onSubmit: (data: FormDataProps) => void;
}

export interface FormDataProps {
  nome_empresa: string;
  nome_contratante: string;
  documentado_por: string;
  data: string;
  numero_contrato: string;
  info_adicionais: string;
}

export default function FormContrato({ onSubmit }: FormContratoProps) {
  const [formData, setFormData] = useState<FormDataProps>({
    nome_empresa: "",
    nome_contratante: "",
    documentado_por: "",
    data: "",
    numero_contrato: "",
    info_adicionais: "",
  });

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2>Dados do Contrato</h2>

      <label>Nome da empresa:</label>
      <input
        type="text"
        name="nome_empresa"
        value={formData.nome_empresa}
        onChange={handleChange}
      />

      <label>Nome do contratante:</label>
      <input
        type="text"
        name="nome_contratante"
        value={formData.nome_contratante}
        onChange={handleChange}
      />

      <label>Quem está documentando:</label>
      <input
        type="text"
        name="documentado_por"
        value={formData.documentado_por}
        onChange={handleChange}
      />

      <label>Data:</label>
      <input
        type="date"
        name="data"
        value={formData.data}
        onChange={handleChange}
      />

      <label>Número do contrato:</label>
      <input
        type="text"
        name="numero_contrato"
        value={formData.numero_contrato}
        onChange={handleChange}
      />

      <label>Informações adicionais:</label>
      <textarea
        name="info_adicionais"
        value={formData.info_adicionais}
        onChange={handleChange}
        placeholder="Outras informações relevantes do contrato..."
      />

      <div className={styles.buttonWrapper}>
        <Button type="submit" variant="primary">
          Salvar
        </Button>
      </div>
    </form>
  );
}
