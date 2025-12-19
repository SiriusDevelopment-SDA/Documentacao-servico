"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import FormContrato from "../criar/components/form/FormContrato";
import ModalERP from "./components/erp/ModalErp";
import styles from "./styles.module.scss";
import { api } from "@/services/api";

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [documentacaoId, setDocumentacaoId] = useState<number | null>(null);
  const [selectedERP, setSelectedERP] = useState<number | null>(null);

  const handleSubmit = async (dados: any) => {
    try {
      const response = await api.post("/documentacoes", dados);

      // garante número
      setDocumentacaoId(Number(response.data.id));
      setModalOpen(true);
    } catch (error) {
      console.error("Erro ao salvar documentação:", error);
    }
  };

  // callback chamado pelo ModalERP
  const handleSelectERP = (erpId: number) => {
    setSelectedERP(erpId);
  };

  return (
    <div className={styles.container}>
      {/* Botão Voltar */}
      <Link href="/" className={styles.backFloating}>
        <ArrowLeftIcon size={22} />
      </Link>

      {/* FORM */}
      <FormContrato onSubmit={handleSubmit} />

      {/* MODAL ERP */}
      <ModalERP
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        documentacaoId={documentacaoId}
        onSelectErp={handleSelectERP}
      />
    </div>
  );
}
