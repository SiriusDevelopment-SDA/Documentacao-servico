// src/app/parametros-padronizados/types.ts

export interface Parametro {
  id: number;
  nome: string;
  valor: string;
  erpId: number;  // Garantir que 'erpId' seja necessário e obrigatório
}
