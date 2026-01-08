"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import EmpresaModal from "./components/modal/EditModalEmpresa";

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

export default function EmpresasPage() {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [erps, setErps] = useState<Erp[]>([]);
    const [search, setSearch] = useState("");

    const [nome, setNome] = useState("");
    const [cpfCnpj, setCpfCnpj] = useState("");
    const [erpId, setErpId] = useState("");

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null);

    // Buscar empresas
    const fetchEmpresas = async () => {
        try {
            const res = await fetch("https://api.coraxy.com.br/api/empresa");
            const data = await res.json();
            setEmpresas(data);
        } catch (err) {
            console.error("Erro ao buscar empresas:", err);
        }
    };

    // Buscar ERPs
    const fetchErps = async () => {
        try {
            const res = await fetch("https://api.coraxy.com.br/api/erp");
            const data = await res.json();
            setErps(data);
        } catch (err) {
            console.error("Erro ao buscar ERPs:", err);
        }
    };

    // Criar empresa
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await fetch("https://api.coraxy.com.br/api/empresa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome,
                    cpf_cnpj: cpfCnpj,
                    erpId: Number(erpId),
                }),
            });

            setNome("");
            setCpfCnpj("");
            setErpId("");

            await fetchEmpresas();
        } catch (err) {
            console.error("Erro ao criar empresa:", err);
        }
    };

    // Salvar edição (PUT)
    const handleSave = async (empresaAtualizada: Empresa) => {
        try {
            await fetch(`https://api.coraxy.com.br/api/empresa/${empresaAtualizada.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: empresaAtualizada.nome,
                    cpf_cnpj: empresaAtualizada.cpf_cnpj,
                    erpId: empresaAtualizada.erpId,
                }),
            });

            setModalOpen(false);
            setEmpresaSelecionada(null);
            fetchEmpresas();
        } catch (err) {
            console.error("Erro ao atualizar empresa:", err);
        }
    };

    useEffect(() => {
        fetchEmpresas();
        fetchErps();
    }, []);

    const empresasFiltradas = empresas.filter(emp =>
        emp.nome.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Empresas</h1>

            <form onSubmit={handleCreate} className={styles.form}>
                <input
                    placeholder="Nome da empresa"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className={styles.input}
                />

                <input
                    placeholder="CPF/CNPJ"
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    className={styles.input}
                />

                <select
                    value={erpId}
                    onChange={(e) => setErpId(e.target.value)}
                    required
                    className={styles.input}
                >
                    <option value="" disabled>Selecione um ERP</option>
                    {erps.map((erp) => (
                        <option key={erp.id} value={erp.id}>
                            {erp.nome}
                        </option>
                    ))}
                </select>

                <button type="submit" className={styles.button}>
                    Criar empresa
                </button>
            </form>

            <input
                placeholder="Pesquisar empresas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.search}
            />

            <ul className={styles.list}>
                {empresasFiltradas.length > 0 ? (
                    empresasFiltradas.map((emp) => (
                        <li
                            key={emp.id}
                            className={styles.item}
                            onClick={() => {
                                setEmpresaSelecionada(emp);
                                setModalOpen(true);
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            <strong>{emp.nome}</strong> — CNPJ: {emp.cpf_cnpj || "—"} — ERP: {emp.erpId}
                        </li>
                    ))
                ) : (
                    <p>Nenhuma empresa encontrada.</p>
                )}
            </ul>

            {/* MODAL */}
            <EmpresaModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                empresa={empresaSelecionada}
                erps={erps}
                onSave={handleSave}
            />
        </div>
    );
}
