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
  const [selectedERP, setSelectedERP] = useState<string | null>(null);

  const handleSubmit = async (dados: any) => {
    try {
      const response = await api.post("/documentacao", dados);
      console.log("Form salvo!", response.data);
      setDocumentacaoId(response.data.id);
      setModalOpen(true);
    } catch (error) {
      console.log("Erro ao salvar:", error);
    }
  };

  // Função que lida com a seleção do ERP no modal
  const handleSelectERP = (selectedErpId: string) => {
    setSelectedERP(selectedErpId); // Define o ERP selecionado
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
        onSelectERP={handleSelectERP} // Passando a função de selecionar o ERP para o modal
      />
    </div>
  );
}
