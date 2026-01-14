"use client";

import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";

import DetalhesRegra from "../modal/DetalhesModal";
import styles from "./tabela.module.scss";

export default function TabelaRegras() {
    const [regras, setRegras] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [detailsVisible, setDetailsVisible] = useState<boolean>(false);

    const [selectedRegra, setSelectedRegra] = useState<any>(null);

    const API_URL = "https://api.coraxy.com.br/api";

    const fetchRegras = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/regras`);
            const data = await res.json();

            const formatted = data.map((r: any) => ({
                id: r.id,
                descricao: r.descricao,
                ativa: r.ativa,
                empresa: r.empresas?.length ? r.empresas[0].empresa?.nome : "-",
                erpNome: r.erp?.nome || "-",
                raw: r
            }));

            setRegras(formatted);
        } catch (err) {
            console.error("Erro ao buscar regras:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegras();
    }, []);

    const statusTemplate = (rowData: any) => {
        return <Tag value={rowData.ativa ? "Ativo" : "Inativo"} severity={rowData.ativa ? "success" : "danger"} />;
    };

    const detalhesTemplate = (row: any) => (
        <Button
            label="Detalhes"
            size="small"
            onClick={() => {
                setSelectedRegra(row.raw);
                setDetailsVisible(true);
            }}
        />
    );

    const editTemplate = (row: any) => (
        <Button
            label="Editar"
            size="small"
            severity="secondary"
            onClick={() => {
                const clone = JSON.parse(JSON.stringify(row.raw));
                clone.setores?.forEach((setor: any) => {
                    setor.padroes?.forEach((p: any) => (p.availablePadroes = []));
                    setor.necessarios?.forEach((n: any) => (n.availableNecessarios = []));
                });

                setSelectedRegra(clone);
                setEditVisible(true);
            }}
        />
    );

    const deleteTemplate = (row: any) => (
        <Button
            label="Excluir"
            size="small"
            severity="danger"
            onClick={() => handleDelete(row.id)}
        />
    );

    const handleDelete = (id: number) => {
        confirmDialog({
            message: `Deseja realmente excluir a regra ${id}?`,
            header: "Confirmar exclusão",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Sim",
            rejectLabel: "Não",
            accept: async () => {
                await fetch(`${API_URL}/regras/delete/${id}`, { method: "DELETE" });
                fetchRegras();
            }
        });
    };

    const salvarEdicao = async () => {
        if (!selectedRegra) return;

        const payload = {
            descricao: selectedRegra.descricao,
            ativa: selectedRegra.ativa,
            erpId: selectedRegra.erpId,
            setores: selectedRegra.setores?.map((s: any) => ({
                id: s.id,
                padroes: s.padroes?.map((p: any) => ({
                    id: p.id,
                    padraoId: p.padrao.id
                })),
                necessarios: s.necessarios?.map((n: any) => ({
                    id: n.id,
                    necessarioId: n.necessario.id
                }))
            }))
        };

        await fetch(`${API_URL}/regras/update/${selectedRegra.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        setEditVisible(false);
        fetchRegras();
    };

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ height: "300px" }}>
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <>
            <div className={styles.tableWrapper}>
                <DataTable
                    value={regras}
                    paginator
                    rows={10} // <-- mantém a paginação e remove o dropdown
                    tableStyle={{ minWidth: "55rem" }}
                >
                    <Column field="id" header="ID" style={{ width: "80px" }} />
                    <Column field="descricao" header="Descrição" />
                    <Column field="empresa" header="Empresa" />
                    <Column field="erpNome" header="ERP" />
                    <Column header="Status" body={statusTemplate} style={{ width: "120px" }} />
                    <Column header="Detalhes" body={detalhesTemplate} style={{ width: "120px" }} />
                    <Column header="Editar" body={editTemplate} style={{ width: "120px" }} />
                    <Column header="Excluir" body={deleteTemplate} style={{ width: "120px" }} />
                </DataTable>
            </div>

            <Dialog
                header="Detalhes da Regra"
                visible={detailsVisible}
                style={{ width: "70vw" }}
                onHide={() => setDetailsVisible(false)}
            >
                {selectedRegra && <DetalhesRegra regra={selectedRegra} />}
            </Dialog>

            <Dialog
                header="Editar Regra"
                visible={editVisible}
                style={{ width: "60vw" }}
                onHide={() => setEditVisible(false)}
            >
                {selectedRegra && (
                    <div className="flex flex-column gap-3">
                        <label>Descrição</label>
                        <InputText
                            className="w-full"
                            value={selectedRegra.descricao}
                            onChange={(e) => setSelectedRegra({ ...selectedRegra, descricao: e.target.value })}
                        />

                        <label>Status</label>
                        <Dropdown
                            className="w-full"
                            value={selectedRegra.ativa}
                            options={[
                                { label: "Ativo", value: true },
                                { label: "Inativo", value: false }
                            ]}
                            onChange={(e) => setSelectedRegra({ ...selectedRegra, ativa: e.value })}
                        />

                        <label>ERP</label>
                        <InputText
                            className="w-full mb-3"
                            value={selectedRegra.erp?.nome ?? "-"}
                            disabled
                        />

                        <hr />

                        {selectedRegra.setores?.map((setor: any, setorIndex: number) => (
                            <div key={setor.id}>
                                <h3>{setor.nome}</h3>

                                <h4>Parâmetros Padronizados</h4>
                                {setor.padroes?.map((p: any, pIndex: number) => (
                                    <Dropdown
                                        key={p.id}
                                        className="w-full mt-2"
                                        value={p.padrao.id}
                                        options={p.availablePadroes || []}
                                        optionLabel="nome"
                                        optionValue="id"
                                        placeholder={p.padrao.nome}
                                        onChange={(e) => {
                                            const clone = structuredClone(selectedRegra);
                                            clone.setores[setorIndex].padroes[pIndex].padrao.id = e.value;
                                            setSelectedRegra(clone);
                                        }}
                                    />
                                ))}

                                <h4 className="mt-4">Parâmetros Necessários</h4>
                                {setor.necessarios?.map((n: any, nIndex: number) => (
                                    <Dropdown
                                        key={n.id}
                                        className="w-full mt-2"
                                        value={n.necessario.id}
                                        options={n.availableNecessarios || []}
                                        optionLabel="nome"
                                        optionValue="id"
                                        placeholder={n.necessario.nome}
                                        onChange={(e) => {
                                            const clone = structuredClone(selectedRegra);
                                            clone.setores[setorIndex].necessarios[nIndex].necessario.id = e.value;
                                            setSelectedRegra(clone);
                                        }}
                                    />
                                ))}
                            </div>
                        ))}

                        <Button
                            label="Salvar"
                            onClick={salvarEdicao}
                            className="botao-salvar mt-3"
                        />

                    </div>
                )}
            </Dialog>

            <ConfirmDialog />
        </>
    );
}
