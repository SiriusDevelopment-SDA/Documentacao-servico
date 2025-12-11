"use client";
import { useState } from "react";
import FormContrato from "../criar/components/form/FormContrato";
import ModalERP from "./components/erp/ModalErp";
import styles from "./styles.module.scss";
import { api } from "@/services/api";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [documentacaoId, setDocumentacaoId] = useState<string | null>(null);

  const handleSubmit = async (dados: any) => {
    try {
      const response = await api.post("/documentacao", dados);

      console.log("Form salvo!", response.data);

      // pega ID retornado do backend
      setDocumentacaoId(response.data.id);

      // abre modal
      setModalOpen(true);

    } catch (error) {
      console.log("Erro ao salvar:", error);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* Botão Voltar */}
      <Link href="/" className={styles.backFloating}>
        <ArrowLeftIcon size={22} />
      </Link>

      {/* FORM */}
      <FormContrato onSubmit={handleSubmit} />

      {/* MODAL DE ERP */}
      <ModalERP
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        documentacaoId={documentacaoId}
      />
    </div>
  );
}
