/* =========================================================
   JS • Documentação de Serviços (UNIFICA & MAESTRO)
   Observação:
   - O conteúdo/semântica do código foi preservado.
   - Apenas reorganizado por seções + comentários.
   - Funções repetidas do código original foram mantidas
     e etiquetadas como DUPLICATA para referência.
========================================================= */


/* =========================================================
   [SEÇÃO 1] CONSTANTES, DADOS E ESTADO GLOBAL
   - Flags de comportamento
   - Estrutura erpData (ERPs + serviços)
   - Estado global (currentErp, currentServiceConfig)
========================================================= */

// ============= constante de comportamento =============
const AUTO_ADD_DEFAULT_SERVICES = false; // false = não pré-popula serviços no novo ERP
// ============= final da constante de comportamento =============


// ============= dados estáticos de ERPs e serviços =============
const erpData = {
    IXC: {
        name: 'IXC',
        active: true,
        services: [
            // {
            //     id: 'buscar_cliente',
            //     label: 'Buscar cliente',
            //     checked: true,
            //     config: {
            //         descricao: 'Busca informações de clientes no sistema IXC',
            //         instrucoes: 'Utilize este serviço para localizar clientes por ID, nome ou documento',
            //         endpoint: 'https://demo.ixcsoft.com.br/webservice/v1/cliente',
            //         parametros: JSON.stringify({
            //             "qtype": "cliente.id",
            //             "query": "1",
            //             "oper": ">=",
            //             "page": "1",
            //             "rp": "19",
            //             "sortname": "cliente.id",
            //             "sortorder": "desc"
            //         }, null, 2),
            //         prerequisitos: {
            //             exigeContrato: false,
            //             exigeCpfCnpj: true,
            //             exigeLoginAtivo: true
            //         },
            //         responsavelPadrao: 'Suporte Técnico',
            //         ativo: true,
            //         semAPI: false
            //     }
            // },
            // {
            //     id: 'buscar_contrato',
            //     label: 'Buscar contrato',
            //     checked: true,
            //     config: {
            //         descricao: 'Busca contratos de clientes no sistema IXC',
            //         instrucoes: 'Utilize para localizar contratos ativos ou inativos',
            //         endpoint: 'https://host/webservice/v1/cliente_contrato',
            //         parametros: JSON.stringify({
            //             "qtype": "cliente_contrato.id",
            //             "query": "3,1",
            //             "oper": "NI",
            //             "page": "1",
            //             "rp": "100",
            //             "sortname": "cliente_contrato.id",
            //             "sortorder": "asc"
            //         }, null, 2),
            //         prerequisitos: {
            //             exigeContrato: true,
            //             exigeCpfCnpj: true,
            //             exigeLoginAtivo: true
            //         },
            //         responsavelPadrao: 'Comercial',
            //         ativo: true,
            //         semAPI: false
            //     }
            // },
            // {
            //     id: 'buscar_faturas',
            //     label: 'Buscar faturas',
            //     checked: true,
            //     config: {
            //         descricao: 'Consulta faturas em aberto ou pagas',
            //         instrucoes: 'Permite visualizar histórico de faturas do cliente',
            //         endpoint: 'https://host/webservice/v1/fn_areceber',
            //         parametros: JSON.stringify({
            //             "qtype": "cliente_contrato.id",
            //             "query": "3,1",
            //             "oper": "NI",
            //             "page": "1",
            //             "rp": "100",
            //             "sortname": "cliente_contrato.id",
            //             "sortorder": "asc"
            //         }, null, 2),
            //         prerequisitos: {
            //             exigeContrato: true,
            //             exigeCpfCnpj: false,
            //             exigeLoginAtivo: true
            //         },
            //         responsavelPadrao: 'Financeiro',
            //         ativo: true,
            //         semAPI: false
            //     }
            // },
            // {
            //     id: 'gerar_fatura',
            //     label: 'Gerar fatura',
            //     checked: true,
            //     config: {
            //         descricao: 'Gera nova fatura para o cliente',
            //         instrucoes: 'Criar faturas avulsas ou recorrentes',
            //         endpoint: 'https://host/webservice/v1/cliente_contrato',
            //         parametros: JSON.stringify({
            //             "qtype": "cliente_contrato.id",
            //             "query": "3,1",
            //             "oper": "NI",
            //             "page": "1",
            //             "rp": "100",
            //             "sortname": "cliente_contrato.id",
            //             "sortorder": "asc"
            //         }, null, 2),
            //         prerequisitos: {
            //             exigeContrato: true,
            //             exigeCpfCnpj: true,
            //             exigeLoginAtivo: true
            //         },
            //         responsavelPadrao: 'Financeiro',
            //         ativo: true,
            //         semAPI: false
            //     }
            // },
            // {
            //     id: 'gerar_pix_fatura',
            //     label: 'Gerar PIX da fatura',
            //     checked: true,
            //     config: {
            //         descricao: 'Gera código PIX para pagamento de faturas',
            //         instrucoes: 'Facilita o pagamento via PIX para clientes',
            //         endpoint: 'https://host/webservice/v1/cliente_contrato',
            //         parametros: JSON.stringify({
            //             "qtype": "cliente_contrato.id",
            //             "query": "3,1",
            //             "oper": "NI",
            //             "page": "1",
            //             "rp": "100",
            //             "sortname": "cliente_contrato.id",
            //             "sortorder": "asc"
            //         }, null, 2),
            //         prerequisitos: {
            //             exigeContrato: true,
            //             exigeCpfCnpj: false,
            //             exigeLoginAtivo: false
            //         },
            //         responsavelPadrao: 'Financeiro',
            //         ativo: true,
            //         semAPI: false
            //     }
            // },
            // {
            //     id: 'renegociar_fatura',
            //     label: 'Renegociar fatura',
            //     checked: true,
            //     config: {
            //         descricao: 'Permite renegociação de débitos em aberto',
            //         instrucoes: 'Ferramenta para acordos e parcelamentos',
            //         endpoint: 'https://host/webservice/v1/cliente_contrato',
            //         parametros: JSON.stringify({
            //             "qtype": "cliente_contrato.id",
            //             "query": "3,1",
            //             "oper": "NI",
            //             "page": "1",
            //             "rp": "100",
            //             "sortname": "cliente_contrato.id",
            //             "sortorder": "asc"
            //         }, null, 2),
            //         prerequisitos: {
            //             exigeContrato: true,
            //             exigeCpfCnpj: true,
            //             exigeLoginAtivo: true
            //         },
            //         responsavelPadrao: 'Financeiro',
            //         ativo: true,
            //         semAPI: false
            //     }
            // },
            // {
            //     id: 'desbloqueio_confianca',
            //     label: 'Desbloqueio de confiança',
            //     checked: true,
            //     config: {
            //         descricao: 'Desbloqueio temporário por confiança',
            //         instrucoes: 'Permite acesso temporário mediante compromisso de pagamento',
            //         endpoint: 'https://host/webservice/v1/cliente_contrato',
            //         parametros: JSON.stringify({
            //             "qtype": "cliente_contrato.id",
            //             "query": "3,1",
            //             "oper": "NI",
            //             "page": "1",
            //             "rp": "100",
            //             "sortname": "cliente_contrato.id",
            //             "sortorder": "asc"
            //         }, null, 2),
            //         prerequisitos: {
            //             exigeContrato: true,
            //             exigeCpfCnpj: true,
            //             exigeLoginAtivo: false
            //         },
            //         responsavelPadrao: 'Suporte',
            //         ativo: true,
            //         semAPI: false
            //     }
            // },
            // {
            //     id: 'verificar_sinal',
            //     label: 'Verificar sinal',
            //     checked: true,
            //     config: {
            //         descricao: 'Verifica qualidade do sinal do cliente',
            //         instrucoes: 'Diagnóstico técnico da conexão',
            //         endpoint: 'https://host/webservice/v1/cliente_contrato',
            //         parametros: JSON.stringify({
            //             "qtype": "cliente_contrato.id",
            //             "query": "3,1",
            //             "oper": "NI",
            //             "page": "1",
            //             "rp": "100",
            //             "sortname": "cliente_contrato.id",
            //             "sortorder": "asc"
            //         }, null, 2),
            //         prerequisitos: {
            //             exigeContrato: true,
            //             exigeCpfCnpj: false,
            //             exigeLoginAtivo: true
            //         },
            //         responsavelPadrao: 'Suporte Técnico',
            //         ativo: true,
            //         semAPI: false
            //     }
            // },
            // {
            //     id: 'abrir_chamado',
            //     label: 'Abrir chamado',
            //     checked: true,
            //     config: {
            //         descricao: 'Abertura de chamados técnicos',
            //         instrucoes: 'Registra solicitações de suporte técnico',
            //         endpoint: 'https://host/webservice/v1/cliente_contrato',
            //         parametros: JSON.stringify({
            //             "qtype": "cliente_contrato.id",
            //             "query": "3,1",
            //             "oper": "NI",
            //             "page": "1",
            //             "rp": "100",
            //             "sortname": "cliente_contrato.id",
            //             "sortorder": "asc"
            //         }, null, 2),
            //         prerequisitos: {
            //             exigeContrato: true,
            //             exigeCpfCnpj: false,
            //             exigeLoginAtivo: true
            //         },
            //         responsavelPadrao: 'Suporte Técnico',
            //         ativo: true,
            //         semAPI: false
            //     }
            // },
            // {
            //     id: 'cadastrar_lead',
            //     label: 'Cadastrar lead',
            //     checked: true,
            //     config: {
            //         descricao: 'Cadastro de novos leads/prospects',
            //         instrucoes: 'Registra potenciais clientes no sistema',
            //         endpoint: 'https://demo.ixcsoft.com.br/webservice/v1/contato',
            //         parametros: JSON.stringify({
            //             "nome": "API Ferreira",
            //             "data_cadastro": "24/06/2024",
            //             "fone_celular": "49999999999"
            //         }, null, 2),
            //         prerequisitos: {
            //             exigeContrato: false,
            //             exigeCpfCnpj: false,
            //             exigeLoginAtivo: false
            //         },
            //         responsavelPadrao: 'Comercial',
            //         ativo: true,
            //         semAPI: false
            //     }
            // },
            // {
            //     id: 'buscar_cobertura',
            //     label: 'Buscar cobertura',
            //     checked: true,
            //     config: {
            //         descricao: 'Verifica cobertura de rede na região',
            //         instrucoes: 'Consulta disponibilidade de serviços por localização',
            //         endpoint: 'https://demo.ixcsoft.com.br/webservice/v1/rad_caixa_ftth',
            //         parametros: JSON.stringify({
            //             "qtype": "rad_caixa_ftth.id",
            //             "query": "1",
            //             "oper": ">=",
            //             "page": "1",
            //             "rp": "1000",
            //             "sortname": "rad_caixa_ftth.id",
            //             "sortorder": "desc"
            //         }, null, 2),
            //         prerequisitos: {
            //             exigeContrato: false,
            //             exigeCpfCnpj: false,
            //             exigeLoginAtivo: false
            //         },
            //         responsavelPadrao: 'Comercial',
            //         ativo: true,
            //         semAPI: false
            //     }
            // },
            
        ]
    },
    SGP: {
        name: 'SGP',
        active: true,
        services: [
            // { id: 'buscar_faturas_sgp', label: 'Buscar faturas', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'gera_fatura_pdf_pix', label: 'Gera fatura em PDF/PIX', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'desbloqueio_confianca_sgp', label: 'Desbloqueio de confiança', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'responde_duvidas_institucionais', label: 'Responde dúvidas institucionais', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'negociacao_faturas', label: 'Negociação de faturas', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'fluxo_ativo_disparo_cobranca', label: 'Fluxo de ativo/disparo de cobrança', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'disparo_pos_cobranca', label: 'Disparo de pós cobrança', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'agente_responsavel_criacao_cobrancas', label: 'Agente responsável pela criação das cobranças', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'faixa_inadimplencia', label: 'Faixa de inadimplência', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'campanhas_personalizadas', label: 'Campanhas personalizadas', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'business_intelligence', label: 'Business Intelligence', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'envio_email_finalizacao_campanha', label: 'Envio no e-mail da finalização da campanha', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'analise_comportamental_cobranca', label: 'Análise comportamental de cobrança', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'alteracao_data_fatura_pro_rata', label: 'Alteração de data com fatura pró-rata', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },

            // // Agente Suporte
            // { id: 'agente_suporte', label: 'Agente Suporte', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'identificar_motivo_bloqueio', label: 'Identificar motivo de bloqueio', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'identificar_dispositivo_incompativel', label: 'Identificar dispositivo incompatível', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'identificar_sinal_los', label: 'Identificar sinal de los', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'tratativa_massiva', label: 'Tratativa de massiva', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'identifica_perda_sinal_atenuacao', label: 'Identifica perda de sinal (atenuação)', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'abertura_chamados_sgp', label: 'Abertura de chamados', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'responde_duvidas_institucionais_suporte', label: 'Responde dúvidas institucionais', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'analise_sentimento', label: 'Análise de sentimento', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'encaminhar_especialista', label: 'Encaminhar especialista', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'troca_nome_senha', label: 'Troca de nome e senha', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },

            // // Agente Comercial
            // { id: 'agente_comercial', label: 'Agente Comercial', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'nova_contratacao', label: 'Nova contratação', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'apresentacao_planos', label: 'Apresentação de planos', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'tratativa_personalizada', label: 'Tratativa personalizada', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'identificacao_pacote_correto', label: 'Identificação do pacote correto', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'segundo_ponto', label: '2º ponto', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'mudanca_endereco_comodo_ponto', label: 'Mudança de endereço/cômodo/ponto', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'identifica_localizacao_fisica', label: 'Identifica localização física', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } },
            // { id: 'downgrade_upgrade', label: 'Downgrade e upgrade', checked: true, config: { descricao: '', instrucoes: '', endpoint: '', parametros: '{}', prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false }, responsavelPadrao: '', ativo: true, semAPI: false } }
        ]
    }
    
};
// ============= final dos dados estáticos =============


// ============= estado global (ERP/serviço atuais) =============
let currentErp = null;
let currentServiceConfig = null;
// ============= final do estado global =============


/* =========================================================
   [SEÇÃO 2] INICIALIZAÇÃO E LISTENERS GERAIS
   - DOMContentLoaded
   - Setup geral de eventos
   - Listeners para modais
   - Proteção de submissão do form
========================================================= */

// ============= inicialização principal no DOMContentLoaded =============
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSavedData();

    const form = document.getElementById('servicesForm');

    // 1) nunca submeter esse form (tudo é controlado por JS)
    form.addEventListener('submit', (e) => e.preventDefault());

    // 2) impedir Enter de submeter (exceto em textarea)
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') e.preventDefault();
    });

    // 3) dar type="button" para qualquer botão sem type (defensivo)
    document.querySelectorAll('#servicesForm button:not([type])')
      .forEach(btn => btn.type = 'button');
    document.querySelectorAll('.modal button:not([type])')   // opcional, por clareza
      .forEach(btn => btn.type = 'button');

    // 4) desliga a validação nativa do HTML5 (validação é via JS)
    form.setAttribute('novalidate', '');
});
// ============= final da inicialização principal =============


// ============= listener dedicado: deletar ERP custom =============
document.getElementById('deleteServiceBtn2').addEventListener('click', () => {
    deleteCustomErp();
});
// ============= final do listener de deletar ERP =============


// ============= função: initializeApp =============
function initializeApp() {
    // Definir data atual e preencher protocolo reservado
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('contractDate').value = today;
    ensureProtocolFilled();
}
// ============= final da função initializeApp =============


// ============= função: setupEventListeners (liga botões/ações principais) =============
function setupEventListeners() {
  // Event listeners para ERPs
  document.querySelectorAll('.erp-card').forEach(card => {
    card.addEventListener('click', function () {
      if (!this.classList.contains('disabled')) {
        selectErp(this.dataset.erp);
      }
    });
  });

  // Event listeners para botões principais
  document.getElementById('addNewErpBtn').addEventListener('click', openNewErpModal);
  document.getElementById('selectAllBtn').addEventListener('click', selectAllServices);
  document.getElementById('deselectAllBtn').addEventListener('click', deselectAllServices);
  document.getElementById('addNewServiceBtn').addEventListener('click', openNewServiceModal);

  // Event listeners para botões de ação (prévia/gerar PDFs)
  document.getElementById('previewDevBtn').addEventListener('click', () => showPreview('dev'));
  document.getElementById('previewClientBtn').addEventListener('click', () => showPreview('client'));
  document.getElementById('generatePdfDevBtn').addEventListener('click', () => generatePDF_TEXT('dev'));
  document.getElementById('generatePdfClientBtn').addEventListener('click', () => generatePDF_TEXT('client'));

  // Modal "Motivo de desativação"
  document.getElementById('closeUnselectReasonModal').addEventListener('click', closeUnselectReasonModal);
  document.getElementById('cancelUnselectReason').addEventListener('click', closeUnselectReasonModal);
  document.getElementById('saveUnselectReason').addEventListener('click', saveUnselectReason);

  // Prévia
  document.getElementById('closePreviewBtn').addEventListener('click', closePreview);

  // Protocolo
  const saveBtn = document.getElementById('saveProtocolBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', commitProtocol);
  } else {
    // fallback (caso botão seja inserido dinamicamente)
    document.body.addEventListener('click', (e) => {
      const target = e.target.closest('#saveProtocolBtn');
      if (target) commitProtocol();
    });
  }

  // Modais em geral
  setupModalEventListeners();
}
// ============= final da função setupEventListeners =============


// ============= função utilitária de bind (defensiva) =============
// function bind(id, event, handler) {
//   const el = document.getElementById(id);
//   if (!el) {
//     console.warn(`Elemento #${id} não encontrado para adicionar '${event}'`);
//     return;
//   }
//   el.addEventListener(event, handler);
// }
// ============= final da função utilitária bind =============


// ============= função: setupModalEventListeners (liga ações de cada modal) =============
function setupModalEventListeners() {
    // Modal Novo ERP
    document.getElementById('closeNewErpModal').addEventListener('click', closeNewErpModal);
    document.getElementById('cancelNewErp').addEventListener('click', closeNewErpModal);
    document.getElementById('saveNewErp').addEventListener('click', saveNewErp);

    // Modal Configuração de Serviço
    document.getElementById('closeConfigModal').addEventListener('click', closeConfigModal);
    document.getElementById('saveConfigBtn').addEventListener('click', saveServiceConfig);
    document.getElementById('resetConfigBtn').addEventListener('click', resetServiceConfig);
    document.getElementById('newConfigSemAPI').addEventListener('change', toggleNewApiFields);
    document.getElementById('deleteServiceBtn').addEventListener('click', deleteService);
    document.getElementById('configSemAPI').addEventListener('change', toggleApiFields);

    // Modal Novo Serviço
    document.getElementById('closeNewServiceModal').addEventListener('click', closeNewServiceModal);
    document.getElementById('cancelNewService').addEventListener('click', closeNewServiceModal);
    document.getElementById('saveNewService').addEventListener('click', saveNewService);

    // Fechar modais clicando fora (overlay)
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });
}
// ============= final da função setupModalEventListeners =============



/* =========================================================
   [SEÇÃO 3] GERENCIAMENTO DE ERPs
   - Seleção de ERP
   - Criação/remoção de ERPs
   - Cartões de ERP na UI
========================================================= */

// ============= função: selectErp =============
function selectErp(erpName) {
  document.querySelectorAll('.erp-card').forEach(card => card.classList.remove('selected'));
  currentErp = erpName;
  document.querySelector(`[data-erp="${erpName}"]`).classList.add('selected');

  if (AUTO_ADD_DEFAULT_SERVICES && !erpData[erpName].services?.length) {
    addDefaultServicesToErp(erpName);
  }

  document.getElementById('servicesSection').style.display = 'block';
  document.getElementById('servicesTitle').textContent = `Serviços ${erpName}`;
  loadServices(erpName);
  showNotification(`ERP ${erpName} selecionado`, 'success');
}
// ============= final da função selectErp =============


// ============= função: deleteCustomErp (exclui ERP custom) =============
function deleteCustomErp() {
    if (!currentErp) {
        showNotification('Selecione um ERP para excluir', 'error');
        return;
    }

    // Impede exclusão de ERPs fixos
    const fixedErps = ['IXC', 'SGP'];
    if (fixedErps.includes(currentErp)) {
        showNotification('Este ERP não pode ser excluído', 'error');
        return;
    }

    if (!confirm(`Tem certeza que deseja excluir o ERP "${currentErp}"?`)) return;

    // Remove do objeto erpData
    delete erpData[currentErp];

    // Remove do DOM
    const card = document.querySelector(`.erp-card[data-erp="${currentErp}"]`);
    if (card) card.remove();

    // Persiste e reseta
    saveData();
    currentErp = null;
    document.getElementById('servicesSection').style.display = 'none';
    showNotification(`ERP excluído com sucesso`, 'success');
}
// ============= final da função deleteCustomErp =============


// ============= função: addErpCard (cria card visual na grade) =============
function addErpCard(erpName, active = true) {
  const erpGrid = document.querySelector('.erp-grid');
  const card = document.createElement('div');
  card.className = 'erp-card active';
  card.dataset.erp = erpName;

  card.innerHTML = `
    <h3>${erpName}</h3>
    <span class="erp-status active">Ativo</span>
  `;

  erpGrid.appendChild(card);
  card.addEventListener('click', function () { selectErp(this.dataset.erp); });
}
// ============= final da função addErpCard =============


// ============= função: openNewErpModal (abre modal) =============
function openNewErpModal() {
  const name  = document.getElementById('newErpName');
  if (name) name.value = '';
  const modal = document.getElementById('newErpModal');
  if (modal)  modal.classList.add('show');
  else        console.warn('#newErpModal não encontrado no HTML');
}
// ============= final da função openNewErpModal =============

// ============= função: closeNewErpModal (fecha modal) =============
function closeNewErpModal() {
    document.getElementById('newErpModal').classList.remove('show');
}
// ============= final da função closeNewErpModal =============


// ============= função: saveNewErp (salva um novo ERP) =============
function saveNewErp() {
  const name = document.getElementById('newErpName').value.trim();
  const active = true; // por ora, sempre ativo

  if (!name) { showNotification('Nome do ERP é obrigatório', 'error'); return; }
  const nameUpper = name.toUpperCase();
  if (erpData[nameUpper]) { showNotification('ERP já existe', 'error'); return; }

  erpData[nameUpper] = { name: nameUpper, active, services: [] };

  if (AUTO_ADD_DEFAULT_SERVICES) addDefaultServicesToErp(nameUpper);

  addErpCard(nameUpper, active);
  saveData();
  closeNewErpModal();
  showNotification(`ERP ${name} adicionado com sucesso`, 'success');
}
// ============= final da função saveNewErp =============


// ============= função: addDefaultServicesToErp (pré-popula serviços se flag ligada) =============
function addDefaultServicesToErp(erpName) {
  const erp = erpData[erpName];
  if (!erp) return;
  const existing = new Set(erp.services.map(s => s.id));
  Object.values(PRESET_SERVICES).forEach(svc => {
    if (!existing.has(svc.id)) {
      erp.services.push({
        id: svc.id,
        label: svc.label,
        checked: false,                 // nunca marcado por padrão
        config: getTemplate(erpName, svc.id)
      });
    }
  });
}
// ============= final da função addDefaultServicesToErp =============



/* =========================================================
   [SEÇÃO 4] LISTA DE SERVIÇOS + CARDS + CONFIGURAÇÃO
   - Carregar serviços do ERP
   - Criar card visual do serviço
   - Expand/Collapse config
   - Abrir/Salvar/Resetar configurações
   - Ativar/Desativar campos API
   - Selecionar/Desmarcar todos
   - Excluir serviço
========================================================= */

// ============= função: loadServices (renderiza a lista na UI) =============
function loadServices(erpName) {
    const servicesList = document.getElementById('servicesList');
    const erp = erpData[erpName];
    if (!erp) return;

    servicesList.innerHTML = '';
    erp.services.forEach(service => {
        const serviceCard = createServiceCard(service);
        servicesList.appendChild(serviceCard);
    });
}
// ============= final da função loadServices =============


// ============= função: createServiceCard (constrói o card) =============
function createServiceCard(service) {
  const card = document.createElement('div');
  card.className = `service-card ${service.checked ? 'checked' : 'unchecked'}`;
  card.dataset.serviceId = service.id;

  card.innerHTML = `
    <div class="service-header">
      <div class="service-info">
        <input type="checkbox" class="service-checkbox" ${service.checked ? 'checked' : ''}>
        <span class="service-title">${service.label}</span>
        ${service.config.semAPI ? '<span class="erp-status no-api">Sem necessidade de API</span>' : ''}
      </div>
      <div class="service-actions">
        <button type="button" class="service-expand-btn" onclick="toggleServiceConfig('${service.id}')">▼</button>
      </div>
    </div>

    ${(!service.checked && service.unselectedReason) ? `<div class="unselected-reason"></div>` : ''}

    <div class="service-config" id="config-${service.id}">
      <div class="service-config-content">
        <p><strong>Descrição:</strong> ${service.config.descricao || 'Nenhuma configuração definida'}</p>
        <button type="button" class="action-btn primary" onclick="openConfigModal('${service.id}')">Configurar</button>
      </div>
    </div>
  `;

  // Preenche texto do motivo (se houver)
  if (!service.checked && service.unselectedReason) {
    const reasonEl = card.querySelector('.unselected-reason');
    if (reasonEl) {
      reasonEl.textContent = `Serviço disponível mas não selecionado para este contrato, pois ${service.unselectedReason}.`;
    }
  }

  // Checkbox: confirma desmarcação via modal de motivo
  const checkbox = card.querySelector('.service-checkbox');
  checkbox.addEventListener('change', function () {
    if (this.checked) {
      service.checked = true;
      service.unselectedReason = '';
      card.className = 'service-card checked';
      saveData();
      const r = card.querySelector('.unselected-reason');
      if (r) r.remove();
    } else {
      this.checked = true; // mantém marcado até salvar motivo
      openUnselectReasonModal(service.id, this);
    }
  });

  return card;
}
// ============= final da função createServiceCard =============


// ============= função: toggleServiceConfig (expande/colapsa) =============
function toggleServiceConfig(serviceId) {
    const configDiv = document.getElementById(`config-${serviceId}`);
    const button = document.querySelector(`[onclick="toggleServiceConfig('${serviceId}')"]`);
    
    if (configDiv.classList.contains('expanded')) {
        configDiv.classList.remove('expanded');
        button.textContent = '▼';
        button.classList.remove('expanded');
    } else {
        configDiv.classList.add('expanded');
        button.textContent = '▲';
        button.classList.add('expanded');
    }
}
// ============= final da função toggleServiceConfig =============


// ============= função: openConfigModal (preenche e abre) =============
function openConfigModal(serviceId) {
    const erp = erpData[currentErp];
    const service = erp.services.find(s => s.id === serviceId);
    if (!service) return;

    currentServiceConfig = serviceId;

    // Preenche formulário
    document.getElementById('configModalTitle').textContent = `Configuração: ${service.label}`;
    document.getElementById('configDescricao').value = service.config.descricao || '';
    document.getElementById('configInstrucoes').value = service.config.instrucoes || '';
    document.getElementById('configEndpoint').value = service.config.endpoint || '';
    document.getElementById('configParametros').value = service.config.parametros || '{}';
    document.getElementById('configExigeContrato').checked = service.config.prerequisitos?.exigeContrato || false;
    document.getElementById('configExigeCpfCnpj').checked = service.config.prerequisitos?.exigeCpfCnpj || false;
    document.getElementById('configExigeLogin').checked = service.config.prerequisitos?.exigeLoginAtivo || false;
    document.getElementById('configResponsavel').value = service.config.responsavelPadrao || '';
    document.getElementById('configAtivo').checked = service.config.ativo !== false;
    document.getElementById('configSemAPI').checked = service.config.semAPI || false;

    toggleApiFields();

    // Mostrar modal
    document.getElementById('serviceConfigModal').classList.add('show');
}
// ============= final da função openConfigModal =============


// ============= função: closeConfigModal (fecha modal) =============
function closeConfigModal() {
    document.getElementById('serviceConfigModal').classList.remove('show');
    currentServiceConfig = null;
}
// ============= final da função closeConfigModal =============


// ============= função: saveServiceConfig (valida JSON e salva) =============
function saveServiceConfig() {
    if (!currentServiceConfig || !currentErp) return;
    const erp = erpData[currentErp];
    const service = erp.services.find(s => s.id === currentServiceConfig);
    if (!service) return;

    // Validar JSON
    const parametros = document.getElementById('configParametros').value;
    // try {
    //     if (parametros.trim()) JSON.parse(parametros);
    // } catch (e) {
    //     showNotification('Parâmetros JSON inválidos', 'error');
    //     return;
    // } NÃO PRECISA POIS O USUARIO TEM QUE DIGITAR DA FORMA QUE QUISER 

    // Salvar configuração
    service.config = {
        descricao: document.getElementById('configDescricao').value,
        instrucoes: document.getElementById('configInstrucoes').value,
        endpoint: document.getElementById('configEndpoint').value,
        parametros: parametros,
        prerequisitos: {
            exigeContrato: document.getElementById('configExigeContrato').checked,
            exigeCpfCnpj: document.getElementById('configExigeCpfCnpj').checked,
            exigeLoginAtivo: document.getElementById('configExigeLogin').checked
        },
        responsavelPadrao: document.getElementById('configResponsavel').value,
        ativo: document.getElementById('configAtivo').checked,
        semAPI: document.getElementById('configSemAPI').checked
    };

    updateServiceCard(service);
    saveData();
    closeConfigModal();
    showNotification('Configuração salva com sucesso', 'success');
}
// ============= final da função saveServiceConfig =============


// ============= função: resetServiceConfig (restaura padrão) =============
function resetServiceConfig() {
    if (!currentServiceConfig || !currentErp) return;
    const erp = erpData[currentErp];
    const service = erp.services.find(s => s.id === currentServiceConfig);
    if (!service) return;

    if (currentErp === 'IXC') {
        // Mantém valores originais (abre com os já existentes)
        openConfigModal(currentServiceConfig);
    } else {
        // Limpa para outros ERPs
        service.config = {
            descricao: '',
            instrucoes: '',
            endpoint: '',
            parametros: '{}',
            prerequisitos: { exigeContrato: false, exigeCpfCnpj: false, exigeLoginAtivo: false },
            responsavelPadrao: '',
            ativo: true,
            semAPI: false
        };
        openConfigModal(currentServiceConfig);
    }

    showNotification('Configuração resetada', 'success');
}
// ============= final da função resetServiceConfig =============


// ============= função: deactivateParameters (zera endpoint/parametros) =============
function deactivateParameters() {
    document.getElementById('configEndpoint').value = '';
    document.getElementById('configParametros').value = '{}';
    showNotification('Parâmetros desativados', 'warning');
}
// ============= final da função deactivateParameters =============


// ===== Captura serviços padrão (para bloquear exclusão) =====
const SERVICOS_PADRAO = {};
for (const nomeDoErp in erpData) {
  const idsDosServicos = erpData[nomeDoErp].services.map(servico => servico.id);
  SERVICOS_PADRAO[nomeDoErp] = new Set(idsDosServicos);
}


// ============= função: deleteService (excluir serviço do ERP atual) =============
function deleteService() {
  if (!currentServiceConfig || !currentErp) return;

  const esteServicoEhPadrao = SERVICOS_PADRAO[currentErp]?.has(currentServiceConfig);
  if (esteServicoEhPadrao) {
    showNotification('Este serviço é padrão e não pode ser excluído.', 'error');
    return;
  }

  if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

  const listaServicos = erpData[currentErp].services;
  const indiceDoServico = listaServicos.findIndex(servico => servico.id === currentServiceConfig);
  if (indiceDoServico === -1) {
    showNotification('Serviço não encontrado.', 'error');
    return;
  }

  listaServicos.splice(indiceDoServico, 1);
  loadServices(currentErp);
  saveData();
  closeConfigModal();
  showNotification('Serviço excluído com sucesso', 'success');
}
// ============= final da função deleteService =============


// ============= função: toggleApiFields (exibe/oculta campos de API) =============
function toggleApiFields() {
    const semAPI = document.getElementById('configSemAPI').checked;
    const apiFields = document.getElementById('apiFields');
    apiFields.style.display = semAPI ? 'none' : 'block';
}
// ============= final da função toggleApiFields =============


// ============= função: updateServiceCard (reflete config no card) =============
function updateServiceCard(service) {
    const card = document.querySelector(`[data-service-id="${service.id}"]`);
    if (!card) return;

    // Atualiza badge "Sem necessidade de API"
    const statusSpan = card.querySelector('.erp-status.no-api');
    if (service.config.semAPI) {
        if (!statusSpan) {
            const serviceInfo = card.querySelector('.service-info');
            serviceInfo.insertAdjacentHTML('beforeend', '<span class="erp-status no-api">Sem necessidade de API</span>');
        }
    } else {
        if (statusSpan) statusSpan.remove();
    }

    // Atualiza descrição
    const configContent = card.querySelector('.service-config-content p');
    if (configContent) {
        configContent.innerHTML = `<strong>Descrição:</strong> ${service.config.descricao || 'Nenhuma configuração definida'}`;
    }
}
// ============= final da função updateServiceCard =============


// ============= função: selectAllServices (marca todos) =============
function selectAllServices() {
    if (!currentErp) return;
    const erp = erpData[currentErp];
    erp.services.forEach(service => { service.checked = true; });
    loadServices(currentErp);
    saveData();
    showNotification('Todos os serviços selecionados', 'success');
}
// ============= final da função selectAllServices =============


// ============= função: deselectAllServices (desmarca todos) =============
function deselectAllServices() {
    if (!currentErp) return;
    const erp = erpData[currentErp];
    erp.services.forEach(service => { service.checked = false; });
    loadServices(currentErp);
    saveData();
    showNotification('Todos os serviços desmarcados', 'warning');
}
// ============= final da função deselectAllServices =============



/* =========================================================
   [SEÇÃO 5] MODAL "NOVO SERVIÇO" + PRESETS
   - Abertura do modal com chips e busca
   - Seleção de presets e preenchimento
   - Leitura/Validação de config do modal
   - Persistência do novo serviço
   - Helpers de chips
========================================================= */

// ============= estado local dos chips (seleção múltipla) =============
let newServiceSelectedKeys = new Set();
// ============= final do estado local dos chips =============


// ============= função: openNewServiceModal (abre + monta chips e busca) =============
function openNewServiceModal() {
  if (!currentErp) { showNotification('Selecione um ERP primeiro', 'error'); return; }

  newServiceSelectedKeys.clear();

  const nameInput = document.getElementById('newServiceName');
  nameInput.value = '';
  nameInput.disabled = false;

  document.getElementById('newServiceActive').checked = true;

  const wrap = document.getElementById('presetServiceChips');
  wrap.innerHTML = '';

  // cria barra de busca (se ainda não existir)
  let searchWrap = document.getElementById('chipSearchWrap');
  if (!searchWrap) {
    searchWrap = document.createElement('div');
    searchWrap.id = 'chipSearchWrap';
    searchWrap.className = 'chip-search';
    searchWrap.innerHTML = `<input id="chipSearch" type="text" placeholder="Pesquisar serviço..." autocomplete="off">`;
    wrap.parentNode.insertBefore(searchWrap, wrap);

    const tip = document.createElement('div');
    tip.id = 'chipNoResults';
    tip.className = 'chip-empty';
    tip.textContent = 'Nenhum serviço encontrado.';
    tip.style.display = 'none';
    wrap.parentNode.insertBefore(tip, wrap.nextSibling);
  }

  // liga o filtro
  const input = document.getElementById('chipSearch');
  input.value = '';
  input.oninput = debounce(e => filterPresetChips(e.target.value), 60);
  filterPresetChips('');

  // renderiza apenas presets que ainda não existem no ERP
  const existingIds = new Set((erpData[currentErp]?.services || []).map(s => s.id));
  const availablePresets = Object.values(PRESET_SERVICES).filter(p => !existingIds.has(p.id));

  if (availablePresets.length === 0) {
    wrap.innerHTML = '<small class="muted">Todos os atalhos já foram adicionados para este ERP.</small>';
  } else {
    availablePresets.forEach(preset => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip-btn';
      b.dataset.key = preset.id;
      b.textContent = preset.label;
      b.addEventListener('click', () => togglePresetChip(preset.id, b));
      wrap.appendChild(b);
    });
  }

  // começa com config em branco
  fillNewServiceConfig(BLANK_CONFIG);
  toggleNewApiFields();
  document.getElementById('newServiceModal').classList.add('show');
}
// ============= final da função openNewServiceModal =============


// ============= função: togglePresetChip (liga/desliga um chip) =============
function togglePresetChip(key, btn) {
  if (newServiceSelectedKeys.has(key)) {
    newServiceSelectedKeys.delete(key);
    btn.classList.remove('selected');
  } else {
    newServiceSelectedKeys.add(key);
    btn.classList.add('selected');
  }
  updateNewServiceFormState();
}
// ============= final da função togglePresetChip =============


// ============= função: updateNewServiceFormState (aplica 1º preset ou libera manual) =============
function updateNewServiceFormState() {
  const nameInput = document.getElementById('newServiceName');

  if (newServiceSelectedKeys.size > 0) {
    const firstKey = [...newServiceSelectedKeys][0];
    fillNewServiceConfig(getTemplate(currentErp, firstKey));
    nameInput.disabled = true;
    nameInput.value = '';
  } else {
    fillNewServiceConfig(BLANK_CONFIG);
    nameInput.disabled = false;
  }
}
// ============= final da função updateNewServiceFormState =============


// ============= função: applyPresetToNewService (aplica e trava nome) =============
function applyPresetToNewService(key) {
  const preset = PRESET_SERVICES[key];
  if (!preset) return;

  const nameInput = document.getElementById('newServiceName');
  nameInput.value = preset.label;
  nameInput.disabled = true;

  fillNewServiceConfig(JSON.parse(JSON.stringify(preset.config)));

  document.querySelectorAll('#presetServiceChips .chip-btn').forEach(btn => {
    const isSelected = btn.dataset.key === key;
    btn.disabled = !isSelected;
    btn.classList.toggle('selected', isSelected);
    btn.classList.toggle('disabled', !isSelected);
  });

  const blk = document.getElementById('newServiceConfigBlock');
  if (blk) blk.scrollIntoView({ behavior:'smooth', block:'center' });

  showNotification(`Preset aplicado: ${preset.label}`, 'success');
}
// ============= final da função applyPresetToNewService =============


// ============= função: setChipDisabled (habilita/desabilita um chip) =============
function setChipDisabled(key, disabled) {
  const btn = document.querySelector(`#presetServiceChips .chip-btn[data-key="${key}"]`);
  if (!btn) return;
  btn.disabled = disabled;
  btn.classList.toggle('disabled', disabled);
}
// ============= final da função setChipDisabled =============

// ============= função: fillNewServiceConfig (preenche campos do modal) =============
function fillNewServiceConfig(cfg) {
  document.getElementById('newConfigDescricao').value = cfg.descricao || '';
  document.getElementById('newConfigInstrucoes').value = cfg.instrucoes || '';
  document.getElementById('newConfigSemAPI').checked = !!cfg.semAPI;
  document.getElementById('newConfigEndpoint').value = cfg.endpoint || '';
  document.getElementById('newConfigParametros').value = cfg.parametros || '{}';

  document.getElementById('newConfigExigeContrato').checked = !!cfg.prerequisitos?.exigeContrato;
  document.getElementById('newConfigExigeCpfCnpj').checked = !!cfg.prerequisitos?.exigeCpfCnpj;
  document.getElementById('newConfigExigeLogin').checked = !!cfg.prerequisitos?.exigeLoginAtivo;

  document.getElementById('newConfigResponsavel').value = cfg.responsavelPadrao || '';

  toggleNewApiFields();
}
// ============= final da função fillNewServiceConfig =============


// ============= função: readNewServiceConfigFromModal (lê + valida JSON) =============
function readNewServiceConfigFromModal() {
  const parametros = document.getElementById('newConfigParametros').value || '{}';
  //try { if (parametros.trim()) JSON.parse(parametros); }
  //catch { showNotification('Parâmetros JSON inválidos', 'error'); return null; }

  return {
    descricao: document.getElementById('newConfigDescricao').value,
    instrucoes: document.getElementById('newConfigInstrucoes').value,
    endpoint: document.getElementById('newConfigEndpoint').value,
    parametros,
    prerequisitos: {
      exigeContrato: document.getElementById('newConfigExigeContrato').checked,
      exigeCpfCnpj: document.getElementById('newConfigExigeCpfCnpj').checked,
      exigeLoginAtivo: document.getElementById('newConfigExigeLogin').checked
    },
    responsavelPadrao: document.getElementById('newConfigResponsavel').value,
    ativo: document.getElementById('newServiceActive').checked,
    semAPI: document.getElementById('newConfigSemAPI').checked
  };
}
// ============= final da função readNewServiceConfigFromModal =============


// ============= função: toggleNewApiFields (mostra/oculta campos de API do novo serviço) =============
function toggleNewApiFields() {
  const semAPI = document.getElementById('newConfigSemAPI').checked;
  document.getElementById('newApiFields').style.display = semAPI ? 'none' : 'block';
}
// ============= final da função toggleNewApiFields =============


// ============= função: closeNewServiceModal (fecha modal) =============
function closeNewServiceModal() {
    document.getElementById('newServiceModal').classList.remove('show');
}
// ============= final da função closeNewServiceModal =============


// ============= função: saveNewService (cria serviço manual ou por presets) =============
function saveNewService() {
  const erpName = currentErp;
  if (!erpName) { showNotification('Selecione um ERP primeiro', 'error'); return; }
  const erp = erpData[erpName];

  const cfg = readNewServiceConfigFromModal();
  if (!cfg) return;

  const existing = new Set(erp.services.map(s => s.id));
  let created = 0, duplicated = 0;

  if (newServiceSelectedKeys.size > 0) {
    // múltiplos atalhos
    newServiceSelectedKeys.forEach(key => {
      const preset = PRESET_SERVICES[key];
      if (!preset) return;
      if (existing.has(preset.id)) { duplicated++; return; }
      erp.services.push({
        id: preset.id,
        label: preset.label,
        checked: document.getElementById('newServiceActive').checked,
        config: JSON.parse(JSON.stringify(cfg))
      });
      saveTemplate(erpName, preset.id, cfg);
      created++;
    });
  } else {
    // serviço manual
    const name = (document.getElementById('newServiceName').value || '').trim();
    if (!name) { showNotification('Nome do serviço é obrigatório', 'error'); return; }
    const id = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    if (existing.has(id)) { showNotification('Este serviço já está cadastrado para este ERP', 'error'); return; }

    erp.services.push({
      id,
      label: name,
      checked: document.getElementById('newServiceActive').checked,
      config: JSON.parse(JSON.stringify(cfg))
    });
    saveTemplate(erpName, id, cfg);
    created = 1;
  }

  loadServices(erpName);
  saveData();
  closeNewServiceModal();

  let msg = '';
  if (created) msg += `${created} serviço(s) adicionado(s). `;
  if (duplicated) msg += `${duplicated} já existia(m) e foi/foram ignorado(s).`;
  showNotification(msg || 'Nada foi adicionado', created ? 'success' : 'info');
}
// ============= final da função saveNewService =============


// ============= helpers de chips (habilitar tudo) =============
function enableAllChips() {
  document.querySelectorAll('#presetServiceChips .chip-btn').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('disabled', 'selected');
  });
}

// function setChipDisabled(key, disabled) {
//   const btn = document.querySelector(`#presetServiceChips .chip-btn[data-key="${key}"]`);
//   if (!btn) return;
//   btn.disabled = disabled;
//   btn.classList.toggle('disabled', disabled);
// }
// ============= final dos helpers de chips =============



/* =========================================================
   [SEÇÃO 6] PRESETS E CONFIGURAÇÕES BASE
========================================================= */

// ============= constantes: presets e config em branco =============
const PRESET_SERVICES = {
  abrir_chamado:                { id: 'abrir_chamado',                  label: 'Abrir chamado' },
  alterar_nome_wifi:            { id: 'alterar_nome_wifi',              label: 'Alteracao do nome wi-fi' },
  alterar_senha_wifi:           { id: 'alterar_senha_wifi',             label: 'Alteracao da senha wi-fi' },
  alteracao_vencimento:         { id: 'alteracao_vencimento',           label: 'Alteracao vencimento' },
  analise_comportamental:       { id: 'analise_comportamental',         label: 'Analise Comportamental' },
  analise_consumo:              { id: 'analise_consumo',                label: 'Analise Consumo' },
  analise_sentimento:           { id: 'analise_sentimento',             label: 'Analise Sentimento' },
  apresentacao_planos:          { id: 'apresentacao_planos',            label: 'Apresentação planos' },
  assinatura_contrato:          { id: 'assinatura_contrato',            label: 'Assinatura de contrato' },
  buscar_cliente:               { id: 'buscar_cliente',                 label: 'Buscar cliente' },
  buscar_contrato:              { id: 'buscar_contrato',                label: 'Buscar contrato' },
  buscar_faturas:               { id: 'buscar_faturas',                 label: 'Buscar faturas' },
  business_intelligence:        { id: 'business_intelligence',          label: 'Business Intelligence' },
  cadastro_prospeccao:          { id: 'cadastro_prospeccao',            label: 'Cadastro de prospecção' },
  campanhas_personalizadas:     { id: 'campanhas_personalizadas',       label: 'Campanhas Personalizadas' },
  configurar_roteador:          { id: 'configurar_roteador',            label: 'Configurar roteador' },
  consulta_chamados:            { id: 'consulta_chamados',              label: 'Consulta de chamados' },
  consultar_disponibilidade:    { id: 'consultar_disponibilidade',      label: 'Consultar disponibilidade' },
  desbloqueio_confianca:        { id: 'desbloqueio_confianca',          label: 'Desbloqueio confiança' },
  downgrade_upgrade:            { id: 'downgrade_upgrade',              label: 'Downgrade/upgrade' },
  duvidas_institucionais:       { id: 'duvidas_institucionais',         label: 'Dúvidas Institucionais' },
  envio_finalizar_campanha:     { id: 'envio_finalizar_campanha',       label: 'Envio e-mail Finalizar' },
  encaminhar_especialista:      { id: 'encaminhar_especialista',        label: 'Encaminhar Especialista' },
  envio_cobranca:               { id: 'envio_cobranca',                 label: 'Envio cobrança' },
  gerar_fatura:                 { id: 'gerar_fatura',                   label: 'Gerar fatura' },
  gerar_pix_fatura:             { id: 'gerar_pix_fatura',               label: 'Gerar PIX fatura' },
  gerar_protocolo:              { id: 'gerar_protocolo',                label: 'Gerar protocolo' },
  identifica_pacote:            { id: 'identifica_pacote',              label: 'Identifica Pacote' },
  identifica_bloqueio:          { id: 'identifica_bloqueio',            label: 'Identifica Bloqueio' },
  identifica_incompatibilidade: { id: 'identifica_incompatibilidade',   label: 'Identifica Incompatibilidade' },
  identifica_los:               { id: 'identifica_los',                 label: 'Identifica LOS' },
  identifica_atenuacao:         { id: 'identifica_atenuacao',           label: 'Identifica Atenuação' },
  identifica_localizacao:       { id: 'identifica_localizacao',         label: 'Identifica Localização' },
  medir_velocidade:             { id: 'medir_velocidade',               label: 'Medir velocidade' },
  mudanca_endereco_comodo_ponto:{ id: 'mudanca_endereco_comodo_ponto',  label: 'Mudança endereço/cômodo/ponto' },
  nova_contratacao:             { id: 'nova_contratacao',               label: 'Nova contratação' },
  pos_cobranca:                 { id: 'pos_cobranca',                   label: 'Pós cobrança' },
  qualificar_lead:              { id: 'qualificar_lead',                label: 'Qualificar lead' },
  renegociar_fatura:            { id: 'renegociar_fatura',              label: 'Renegociar fatura' },
  regras_negociacao:            { id: 'regras_negociacao',              label: 'Regras de negociação' },
  regua_cobranca:               { id: 'regua_cobranca',                 label: 'Réguas de cobrança' },
  reiniciar_equipamento:        { id: 'reiniciar_equipamento',          label: 'Reiniciar equipamento' },
  reiniciar_ONU:                { id: 'reiniciar_ONU',                  label: 'Reiniciar ONU' },
  segundo_ponto:                { id: 'segundo_ponto',                  label: 'Segundo ponto' },
  tratativa_massiva:            { id: 'tratativa_massiva',              label: 'Tratativa massiva' },
  tratativa_personalizada:      { id: 'tratativa_personalizada',        label: 'Tratativa personalizada' },
  validar_comprovante:          { id: 'validar_comprovante',            label: 'Validar comprovante' },
  verificar_sinal:              { id: 'verificar_sinal',                label: 'Verificar sinal' },
};

const BLANK_CONFIG = {
  descricao: '',
  instrucoes: '',
  endpoint: '',
  parametros: '{}',
  prerequisitos: { exigeContrato:false, exigeCpfCnpj:false, exigeLoginAtivo:false },
  responsavelPadrao: '',
  ativo: true,
  semAPI: false
};
// ============= final das constantes de presets =============



/* =========================================================
   [SEÇÃO 7] PERSISTÊNCIA (localStorage) E TEMPLATES
========================================================= */

// ============= função: saveData (persiste erpData) =============
function saveData() {
    try {
        localStorage.setItem('erpServicesConfig', JSON.stringify(erpData));
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
    }
}
// ============= final da função saveData =============


// ============= chaves e cache dos templates por ERP =============
const LS_KEYS = { ERPS: 'erpServicesConfig', TEMPLATES: 'serviceTemplatesByErp' };
let serviceTemplatesByErp = (() => {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.TEMPLATES) || '{}'); }
  catch { return {}; }
})();
// ============= final das chaves/cache =============


// ============= função: getTemplate (retorna template salvo ou BLANK) =============
function getTemplate(erpName, serviceId) {
  return JSON.parse(JSON.stringify(
    serviceTemplatesByErp?.[erpName]?.[serviceId] || BLANK_CONFIG
  ));
}
// ============= final da função getTemplate =============


// ============= função: saveTemplate (persiste template do serviço) =============
function saveTemplate(erpName, serviceId, cfg) {
  if (!serviceTemplatesByErp[erpName]) serviceTemplatesByErp[erpName] = {};
  serviceTemplatesByErp[erpName][serviceId] = JSON.parse(JSON.stringify(cfg));
  localStorage.setItem(LS_KEYS.TEMPLATES, JSON.stringify(serviceTemplatesByErp));
}
// ============= final da função saveTemplate =============


// ============= função: cloneConfig (helper de cópia profunda) =============
const cloneConfig = cfg => JSON.parse(JSON.stringify(cfg));
// ============= final da função cloneConfig =============


// ============= função: loadSavedData (mescla dados salvos no estado atual) =============
function loadSavedData() {
    try {
        const saved = localStorage.getItem('erpServicesConfig');
        if (saved) {
            const savedData = JSON.parse(saved);
            Object.keys(savedData).forEach(erpKey => {
                if (erpData[erpKey]) {
                    savedData[erpKey].services.forEach(savedService => {
                        const existingService = erpData[erpKey].services.find(s => s.id === savedService.id);
                        if (existingService) {
                          existingService.checked = savedService.checked;
                          existingService.unselectedReason =
                            savedService.unselectedReason ?? existingService.unselectedReason ?? '';
                          existingService.config = { ...existingService.config, ...savedService.config };
                        } else {
                          erpData[erpKey].services.push({
                            ...savedService,
                            unselectedReason: savedService.unselectedReason ?? ''
                          });
                        }
                    });
                } else {
                    erpData[erpKey] = savedData[erpKey];
                    addErpCard(erpKey, savedData[erpKey].active);
                }
            });
        }
    } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
    }
}
// ============= final da função loadSavedData =============



/* =========================================================
   [SEÇÃO 8] VALIDAÇÃO, PRÉVIA (HTML) E PDF (pdfMake)
   - Validação de campos obrigatórios
   - Prévia no DOM
   - Construção de docDefinition (DEV/CLIENT)
========================================================= */

// ============= função: validateRequiredFields (campos do topo) =============
function validateRequiredFields() {
  const contractorNameEl  = document.getElementById('contractorName');
  const documenterEl      = document.getElementById('documenter');
  const contractorNameEEl = document.getElementById('contractorNameE');
  const contractDateEl    = document.getElementById('contractDate');
  const contractNumberEl  = document.getElementById('contractNumber');

  const contractorName  = contractorNameEl ? contractorNameEl.value.trim()  : '';
  const documenter      = documenterEl ? documenterEl.value.trim()          : '';
  const contractorNameE = contractorNameEEl ? contractorNameEEl.value.trim(): '';
  const contractDate    = contractDateEl ? contractDateEl.value.trim()      : '';
  const contractNumber  = contractNumberEl ? contractNumberEl.value.trim()  : '';

  const missingFields = [];
  if (!contractorName)  missingFields.push({ id: 'contractorName',  label: 'Nome do Contratante' });
  if (!documenter)      missingFields.push({ id: 'documenter',      label: 'Quem está documentando' });
  if (!contractorNameE) missingFields.push({ id: 'contractorNameE', label: 'Contractor Name E' });
  if (!contractDate)    missingFields.push({ id: 'contractDate',    label: 'Data do Contrato' });
  if (!contractNumber)  missingFields.push({ id: 'contractNumber',  label: 'Número do Contrato' });

  if (missingFields.length > 0) {
    const first = missingFields[0];
    const el = document.getElementById(first.id);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
    showNotification('Campos obrigatórios não foram preenchidos.', 'error');
    return false;
  }
  return true;
}
// ============= final da função validateRequiredFields =============


// ============= função: showPreview (gera HTML de prévia) =============
function showPreview(type) {
    if (!validateRequiredFields()) return;
    const content = generatePreviewContent(type);
    document.getElementById('previewTitle').textContent = type === 'dev' ? 'Prévia - Registro de Desenvolvedores' : 'Prévia - Contrato de Serviços';
    document.getElementById('previewContent').innerHTML = content;
    document.getElementById('pdfPreview').style.display = 'block';
    document.getElementById('pdfPreview').scrollIntoView({ behavior: 'smooth' });
}
// ============= final da função showPreview =============


// ============= função: closePreview (esconde prévia) =============
function closePreview() {
    document.getElementById('pdfPreview').style.display = 'none';
}
// ============= final da função closePreview =============


// ============= função: generatePreviewContent (HTML da prévia) =============
function generatePreviewContent(type) {
    const contractorNameE = document.getElementById('contractorNameE').value;
    const contractorName = document.getElementById('contractorName').value;
    const documenter = document.getElementById('documenter').value;
    const contractDate = document.getElementById('contractDate').value;
    const contractNumber = document.getElementById('contractNumber').value;
    const additionalInfo = document.getElementById('additionalInfo').value;
    const desiredServices = document.getElementById('desiredServices').value;

    let content = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #4a5568; text-align: center; margin-bottom: 2rem;">
                ${type === 'dev' ? 'REGISTRO DE DESENVOLVEDORES' : 'CONTRATO DE SERVIÇOS'}
            </h1>

            <div style="margin-bottom: 2rem; padding: 1rem; background: #f8fafc; border-radius: 8px;">
                <h2 style="color: #4a5568; margin-bottom: 1rem;">DADOS DO CONTRATO</h2>
                <table style="width: 100%; border-collapse: collapse;">
                <tr>
                        <td style="padding: 0.5rem; font-weight: bold; width: 30%;">Nome da empresa:</td>
                        <td style="padding: 0.5rem;">${contractorNameE}</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem; font-weight: bold; width: 30%;">Nome do Contratante:</td>
                        <td style="padding: 0.5rem;">${contractorName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem; font-weight: bold;">Documentado por:</td>
                        <td style="padding: 0.5rem;">${documenter}</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.5rem; font-weight: bold;">Data:</td>
                        <td style="padding: 0.5rem;">${new Date(contractDate).toLocaleDateString('pt-BR')}</td>
                    </tr>
                    ${contractNumber ? `
                    <tr>
                        <td style="padding: 0.5rem; font-weight: bold;">ERP Selecionado:</td>
                        <td style="padding: 0.5rem;">${currentErp || 'Nenhum'}</td>
                    </tr>
                    ` : ''}
                    ${contractNumber ? `
                    <tr>
                        <td style="padding: 0.5rem; font-weight: bold;">Número do Contrato:</td>
                        <td style="padding: 0.5rem;">${contractNumber}</td>
                    </tr>
                    ` : ''}
                </table>
            </div>
    `;

    if (currentErp && erpData[currentErp]) {
        const erp = erpData[currentErp];
        const selectedServices = erp.services.filter(s => s.checked);
        const unselectedServices = erp.services.filter(s => !s.checked);

        content += `
            <div style="margin-bottom: 2rem;">
                <h2 style="color: #4a5568; margin-bottom: 1rem;">SERVIÇOS SELECIONADOS COM CONFIGURAÇÕES</h2>
        `;

        if (selectedServices.length > 0) {
            selectedServices.forEach(service => {
                content += `
                    <div style="margin-bottom: 1.5rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; background: #f0fff4;">
                        <h3 style="color: #48bb78; margin-bottom: 0.5rem;">✓ ${service.label}</h3>
                `;

                if (type === 'dev') {
                    content += `
                        <div style="margin-left: 1rem; font-size: 0.9rem;">
                            ${service.config.descricao ? `<p><strong>Descrição:</strong> ${service.config.descricao}</p>` : ''}
                            ${service.config.instrucoes ? `<p><strong>Instruções:</strong> ${service.config.instrucoes}</p>` : ''}
                            ${service.config.semAPI ? '<p><strong>Status:</strong> <span style="background: #f5900c; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">SEM NECESSIDADE DE API</span></p>' : ''}
                            ${!service.config.semAPI && service.config.endpoint ? `<p><strong>Endpoint:</strong> ${service.config.endpoint}</p>` : ''}
                            ${!service.config.semAPI && service.config.parametros && service.config.parametros !== '{}' ? `<p><strong>Parâmetros:</strong><br><pre style="background: #f8fafc; padding: 0.5rem; border-radius: 4px; font-size: 0.8rem; overflow-x: auto;">${service.config.parametros}</pre></p>` : ''}
                            ${service.config.prerequisitos && (service.config.prerequisitos.exigeContrato || service.config.prerequisitos.exigeCpfCnpj || service.config.prerequisitos.exigeLoginAtivo) ? `
                                <p><strong>Pré-requisitos:</strong>
                                    ${service.config.prerequisitos.exigeContrato ? '• Exige contrato ' : ''}
                                    ${service.config.prerequisitos.exigeCpfCnpj ? '• Exige CPF/CNPJ ' : ''}
                                    ${service.config.prerequisitos.exigeLoginAtivo ? '• Exige login ativo' : ''}
                                </p>
                            ` : ''}
                            ${service.config.responsavelPadrao ? `<p><strong>Responsável:</strong> ${service.config.responsavelPadrao}</p>` : ''}
                        </div>
                    `;
                }

                content += `</div>`;
            });
        } else {
            content += '<p style="color: #718096; font-style: italic;">Nenhum serviço selecionado.</p>';
        }

        if (unselectedServices.length > 0) {
          content += `<h2 style="color: #4a5568; margin-bottom: 1rem; margin-top: 2rem;">SERVIÇOS NÃO SELECIONADOS</h2>`;
          unselectedServices.forEach(service => {
            const motivo = service.unselectedReason ? `, pois ${escapeHtml(service.unselectedReason)}` : '.';
            content += `
              <div style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #fed7d7; border-radius: 8px; background: #fffafa;">
                <h3 style="color: #f56565; margin-bottom: 0.5rem;">✗ ${escapeHtml(service.label)}</h3>
                <p style="color: #718096; font-size: 0.9rem; margin-left: 1rem;">
                  Serviço disponível mas não selecionado para este contrato${motivo}
                </p>
              </div>
            `;
          });
        }

        content += '</div>';
    }

    function escapeHtml(s='') {
      return s.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    }

    if (desiredServices) {
        content += `
            <div style="margin-bottom: 2rem;">
                <h2 style="color: #4a5568; margin-bottom: 1rem;">SERVIÇOS DESEJADOS (NÃO OFERECIDOS)</h2>
                <div style="padding: 1rem; background: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px;">
                    <p style="white-space: pre-wrap;">${desiredServices}</p>
                </div>
            </div>
        `;
    }

    if (additionalInfo) {
        content += `
            <div style="margin-bottom: 2rem;">
                <h2 style="color: #4a5568; margin-bottom: 1rem;">INFORMAÇÕES ADICIONAIS</h2>
                <div style="padding: 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <p style="white-space: pre-wrap;">${additionalInfo}</p>
                </div>
            </div>
        `;
    }

    content += `
            <div style="margin-top: 3rem; padding: 1rem; background: #f8fafc; border-radius: 8px; text-align: center;">
                <p style="color: #718096; font-size: 0.9rem;">
                    Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
                </p>
            </div>
        </div>
    `;

    return content;
}
// ============= final da função generatePreviewContent =============


// ============= função: collectFormData (extrai campos-chave) =============
function collectFormData() {
  const get = id => (document.getElementById(id)?.value ?? '').trim();
  return {
    contractorNameE: get('contractorNameE'),
    contractorName:  get('contractorName'),
    documenter:      get('documenter'),
    contractDate:    get('contractDate'),
    contractNumber:  get('contractNumber'),
    additionalInfo:  get('additionalInfo'),
    desiredServices: get('desiredServices'),
    currentErp:      currentErp || 'Nenhum'
  };
}
// ============= final da função collectFormData =============


// ============= função: servicesBySelection (separa selecionados/não) =============
function servicesBySelection() {
  if (!currentErp || !erpData[currentErp]) return { selected: [], unselected: [] };
  const all = erpData[currentErp].services || [];
  return { selected: all.filter(s => s.checked), unselected: all.filter(s => !s.checked) };
}
// ============= final da função servicesBySelection =============


// ======= Visual theme e helpers de layout p/ pdfMake =======
const THEME = {
  text:   '#2d3748',
  sub:    '#4a5568',
  mut:    '#718096',
  ok:     '#2f855a',
  warn:   '#c53030',
  brand:  '#4f46e5',
  bgCard: '#f8fafc',
  bgOk:   '#f0fff4',
  bgWarn: '#fffafa',
  line:   '#e2e8f0'
};

function divider(margin=[0,8,0,8]) {
  return { canvas: [{ type:'line', x1:0, y1:0, x2:515, y2:0, lineWidth:1, lineColor:THEME.line }], margin };
}

function kvTable(rows) {
  return {
    table: { widths: ['*','*'], body: rows },
    layout: {
      paddingLeft: () => 8, paddingRight: () => 8, paddingTop: () => 6, paddingBottom: () => 6,
      hLineWidth: (i) => (i === 0 || i === rows.length ? 0 : 1),
      vLineWidth: () => 0, hLineColor: () => THEME.line,
      fillColor: (rowIndex) => (rowIndex % 2 === 0 ? '#ffffff' : '#fbfbfd')
    },
    margin: [0, 6, 0, 0]
  };
}

function chip(text, color='#334155', bg='#eef2ff') {
  return { text, color, background: bg, margin:[0,0,8,0], fontSize:9, bold:true, lineHeight:1.6, alignment:'center', border: [false,false,false,false], width: 'auto', style:'chip' };
}

function codeBox(text) {
  return {
    table: { widths: ['*'], body: [[{ text, style:'code', preserveLeadingSpaces:true }]] },
    layout: {
      paddingLeft: () => 8, paddingRight: () => 8, paddingTop: () => 6, paddingBottom: () => 6,
      hLineWidth: () => 1, vLineWidth: () => 1, hLineColor: () => THEME.line, vLineColor: () => THEME.line
    },
    fillColor: '#f8fafc', margin: [0, 4, 0, 6]
  };
}

const BASE_STYLES = {
  h1:    { fontSize: 18, bold: true, color: THEME.brand },
  h2:    { fontSize: 13, bold: true, color: THEME.sub },
  h3:    { fontSize: 11, bold: true, color: THEME.text },
  h3ok:  { fontSize: 11, bold: true, color: THEME.ok },
  h3warn:{ fontSize: 11, bold: true, color: THEME.warn },
  body:  { fontSize: 10, color: THEME.text },
  mut:   { color: THEME.mut },
  code:  { fontSize: 9, characterSpacing: 0.2, color: '#1f2937' },
  chip:  { margin:[0,0,8,0], bold:true }
};

const PAGE_FOOTER = function(currentPage, pageCount) {
  return { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center', color: THEME.mut, fontSize: 9, margin: [0, 8, 0, 0] };
};

function contractInfoCard(f) {
  const brDate = f.contractDate ? new Date(f.contractDate).toLocaleDateString('pt-BR') : '-';
  return {
    table: {
      widths: [160, '*'],
      body: [
        [{ text:'Nome da empresa:',     bold:true }, f.contractorNameE || '-' ],
        [{ text:'Nome do Contratante:', bold:true }, f.contractorName  || '-' ],
        [{ text:'Documentado por:',     bold:true }, f.documenter      || '-' ],
        [{ text:'Data:',                bold:true }, brDate ],
        [{ text:'ERP Selecionado:',     bold:true }, f.currentErp      || '-' ],
        [{ text:'Número do Contrato:',  bold:true }, f.contractNumber  || '-' ]
      ]
    },
    layout: { paddingLeft: () => 12, paddingRight: () => 12, paddingTop: () => 8, paddingBottom: () => 8, hLineWidth: () => 0, vLineWidth: () => 0 },
    fillColor: THEME.bgCard, margin: [0, 6, 0, 8]
  };
}

function checkIcon(size = 11, color = THEME.ok) {
  const t = size;
  return { canvas: [{ type: 'polyline', points: [ {x:0, y:t*0.55}, {x:t*0.35, y:t}, {x:t, y:0} ], lineWidth: 2, lineColor: color, lineCap: 'round', lineJoin: 'round' }], width: t + 2, height: t };
}

function serviceTitleRow(text, color = THEME.ok) {
  return {
    table: { widths: [14, '*'], body: [[ checkIcon(11, color), { text, style: 'h3', margin: [6,0,0,0], color } ]] },
    layout: 'noBorders'
  };
}

// ============= função: buildDocDev (documento DEV detalhado) =============
function buildDocDev(f, selected, unselected) {
  const header = [
    { text:'REGISTRO DE DESENVOLVEDORES', color:'#ffcd03', style:'h1', alignment:'center', margin:[0,0,0,6] },
    divider([0,8,0,12])
  ];
  const dadosContrato = contractInfoCard(f);

  const blocosSelecionados = selected.length
    ? selected.map(s => {
        const cfg = s.config || {};
        const pre = cfg.prerequisitos || {};
        const preTxt = [
          pre.exigeContrato && 'Exige contrato',
          pre.exigeCpfCnpj && 'Exige CPF/CNPJ',
          pre.exigeLoginAtivo && 'Exige login ativo'
        ].filter(Boolean).join(' • ');

        const stack = [ serviceTitleRow(s.label, THEME.ok) ];
        if (cfg.descricao)  stack.push({ text:`Descrição: ${cfg.descricao}` });
        if (cfg.instrucoes) stack.push({ text:`Instruções: ${cfg.instrucoes}` });

        if (cfg.semAPI) {
          stack.push({ text:'Status: SEM NECESSIDADE DE API', color:'#b45309', margin:[0,2,0,0] });
        } else {
          if (cfg.endpoint) stack.push({ text:`Endpoint: ${cfg.endpoint}`, margin:[0,2,0,0] });
          if (cfg.parametros && cfg.parametros !== '{}') {
            stack.push({ text:'Parâmetros:', bold:true, margin:[0,6,0,2] });
            stack.push(codeBox(cfg.parametros));
          }
        }

        if (preTxt)                stack.push({ text:`Pré-requisitos: ${preTxt}`, margin:[0,4,0,0] });
        if (cfg.responsavelPadrao) stack.push({ text:`Responsável: ${cfg.responsavelPadrao}` });

        return {
          unbreakable: true,
          table: { widths:['*'], body: [[{ stack, border:[false,false,false,false] }]] },
          layout: {
            hLineWidth: () => 1, vLineWidth: () => 1, hLineColor: () => THEME.line, vLineColor: () => THEME.line,
            paddingLeft: () => 10, paddingRight: () => 10, paddingTop: () => 10, paddingBottom: () => 10
          },
          fillColor: THEME.bgOk, margin:[0, 6, 0, 8]
        };
      })
    : [{ text:'Nenhum serviço selecionado.', italics:true, color:THEME.mut }];

  const blocosNaoSel = unselected.length ? [
    { text:'SERVIÇOS NÃO SELECIONADOS', style:'h2', margin:[0,12,0,6] },
    {
      table: { widths:['*'], body: unselected.map(s => [{
        stack: [
          serviceWarnTitleRow(s.label),
          { text:`Serviço disponível mas não selecionado para este contrato${s.unselectedReason ? `, pois ${s.unselectedReason}` : '.'}`, color: THEME.mut, fontSize: 9, margin:[0,2,0,0] }
        ],
        border:[false,false,false,false]
      }]) },
      layout: 'noBorders', margin:[0,0,0,6]
    }
  ] : [];

  const desiredBlock = f.desiredServices && f.desiredServices.trim()
    ? [{ text:'SERVIÇOS DESEJADOS (NÃO OFERECIDOS)', style:'h2', margin:[0,12,0,6] }, { text: f.desiredServices, margin:[0,0,0,8] }]
    : [];

  const infoBlock = f.additionalInfo && f.additionalInfo.trim()
    ? [{ text:'INFORMAÇÕES ADICIONAIS', style:'h2', margin:[0,12,0,6] }, { text: f.additionalInfo, margin:[0,0,0,8] }]
    : [];

  return {
    pageSize: 'A4',
    pageMargins: [28, 32, 28, 40],
    content: [
      ...header,
      { text:'DADOS DO CONTRATO', style:'h2' },
      dadosContrato,
      divider(),
      { text:'SERVIÇOS SELECIONADOS COM CONFIGURAÇÕES', style:'h2', margin:[0,6,0,4] },
      ...blocosSelecionados,
      ...blocosNaoSel,
      ...desiredBlock,
      ...infoBlock,
      divider([0,12,0,8]),
      { text:`Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, style:'mut', alignment:'center' }
    ],
    styles: BASE_STYLES,
    defaultStyle: BASE_STYLES.body,
    footer: PAGE_FOOTER
  };
}
// ============= final da função buildDocDev =============


// ============= função: buildDocClient (documento resumido p/ cliente) =============
function buildDocClient(f, selected, unselected) {
  const header = [
    { text:'Contrato', style:'h1', alignment:'center', margin:[0,0,0,6] },
    divider([0,8,0,12])
  ];

  const dadosContrato = contractInfoCard(f);

  const listaSelecionados = selected.length
    ? selected.map(s => ({
        unbreakable: true,
        table: { widths: ['*'], body: [[{
          columns: [ checkIcon(11, THEME.ok), { text: s.label, style: 'h3', margin: [6, 0, 0, 0], color: THEME.ok } ],
          border: [false, false, false, false]
        }]] },
        layout: {
          hLineWidth: () => 1, vLineWidth: () => 1, hLineColor: () => '#C6F6D5', vLineColor: () => '#C6F6D5',
          paddingLeft: () => 10, paddingRight: () => 10, paddingTop: () => 10, paddingBottom: () => 10
        },
        fillColor: THEME.bgOk, margin: [0, 4, 0, 6]
      }))
    : [{ text:'Nenhum serviço selecionado.', italics:true, color:THEME.mut, margin:[0,4,0,8] }];

  const listaNaoSel = unselected.length ? [
    { text:'SERVIÇOS NÃO SELECIONADOS', style:'h2', margin:[0,12,0,6] },
    {
      table: { widths:['*'], body: unselected.map(s => [{
        stack: [
          serviceWarnTitleRow(s.label),
          { text:`Serviço disponível mas não selecionado para este contrato${s.unselectedReason ? `, pois ${s.unselectedReason}` : '.'}`, color: THEME.mut, fontSize: 9, margin:[0,2,0,0] }
        ],
        border:[false,false,false,false]
      }]) },
      layout:'noBorders', margin:[0,0,0,6]
    }
  ] : [];

  return {
    pageSize: 'A4',
    pageMargins: [28, 32, 28, 40],
    content: [
      ...header,
      { text: 'DADOS DO CONTRATO', style:'h2' },
      dadosContrato,
      divider(),
      { text: 'SERVIÇOS SELECIONADOS', style:'h2', margin:[0,6,0,4] },
      ...listaSelecionados,
      ...listaNaoSel,
      divider([0,12,0,8]),
      { text:`Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, style:'mut', alignment:'center' }
    ],
    styles: BASE_STYLES,
    defaultStyle: BASE_STYLES.body,
    footer: PAGE_FOOTER
  };
}
// ============= final da função buildDocClient =============


// ============= função: generatePDF_TEXT (pdfMake; baixa DEV/CLIENT) =============
function generatePDF_TEXT(type) {
  if (!validateRequiredFields()) return;
  ensureProtocolFilled();

  const f = collectFormData();
  const { selected, unselected } = servicesBySelection();

  const docDefinition = (type === 'dev')
    ? buildDocDev(f, selected, unselected)
    : buildDocClient(f, selected, unselected);

  pdfMake.createPdf(docDefinition).download(
    type === 'dev' ? 'registro_desenvolvedores.pdf' : 'lista_servicos.pdf'
  );
}
// ============= final da função generatePDF_TEXT =============



/* =========================================================
   [SEÇÃO 9] FORM / RESET + NOTIFICAÇÕES
========================================================= */

// ============= função: showNotification (toast simples) =============
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => { notification.remove(); }, 3000);
}
// ============= final da função showNotification =============


// ============= listener: reset do formulário (limpa UI) =============
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('servicesForm');
    if (form) {
        form.addEventListener('reset', function() {
            setTimeout(() => {
                document.querySelectorAll('.erp-card').forEach(card => card.classList.remove('selected'));
                currentErp = null;
                document.getElementById('servicesSection').style.display = 'none';
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('contractDate').value = today;
                showNotification('Formulário limpo', 'success');
            }, 100);
        });
    }
});
// ============= final do listener de reset =============


// ============= listener: bloqueio de submit/Enter (reforço) =============
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('servicesForm');
    if (form) {
        form.addEventListener('submit', (e) => e.preventDefault());
        form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') e.preventDefault();
        });
    }
});
// ============= final do reforço de bloqueio =============



/* =========================================================
   [SEÇÃO 10] PROTOCOLO (SIRIUS-YYYYMMDD-0000)
   - Reserva (HOLD) e commit (NEXT)
   - Persistência em localStorage
========================================================= */

// ============= constantes e helpers de protocolo =============
const PROTO_PREFIX = 'SIRIUS';
const PROTO_KEYS = { NEXT: 'protoNextSeq', HOLD: 'protoHoldSeq' };
const pad2 = n => String(n).padStart(2,'0');
const pad4 = n => String(n).padStart(4,'0');

function getNextSeq() {
  let v = parseInt(localStorage.getItem(PROTO_KEYS.NEXT), 10);
  if (Number.isNaN(v) || v < 0 || v > 9999) v = 0;
  return v;
}
function setNextSeq(v) { localStorage.setItem(PROTO_KEYS.NEXT, String(v % 10000)); }
function getHoldSeq() {
  const s = localStorage.getItem(PROTO_KEYS.HOLD);
  return (s === null) ? null : parseInt(s, 10);
}
function setHoldSeq(n) { localStorage.setItem(PROTO_KEYS.HOLD, String(n)); }
function clearHoldSeq() { localStorage.removeItem(PROTO_KEYS.HOLD); }

function buildProtocol(prefix = PROTO_PREFIX, seq = 0, date = new Date()) {
  const y = date.getFullYear(), m = pad2(date.getMonth() + 1), d = pad2(date.getDate());
  return `${prefix}-${y}${m}${d}-${pad4(seq)}`;
}
// ============= final das constantes/helpers =============


// ============= função: ensureProtocolFilled (pré-preenche/segura nº) =============
function ensureProtocolFilled() {
  const el = document.getElementById('contractNumber');
  if (!el) return;

  let seq = getHoldSeq();
  if (seq === null) {
    seq = getNextSeq();
    setHoldSeq(seq);
  }
  el.value = buildProtocol(PROTO_PREFIX, seq);
}
// ============= final da função ensureProtocolFilled =============


// ============= função: commitProtocol (confirma e avança) =============
function commitProtocol() {
  if (typeof validateRequiredFields === 'function' && !validateRequiredFields()) return;

  const hold = getHoldSeq();
  if (hold === null) { showNotification('Nenhum protocolo para salvar', 'error'); return; }

  const next = (hold + 1) % 10000;
  setNextSeq(next);
  clearHoldSeq();

  ensureProtocolFilled();
  showNotification('Protocolo salvo', 'success');
}
// ============= final da função commitProtocol =============


// ============= listener: sincroniza entre abas =============
window.addEventListener('storage', (e) => {
  if (e.key === PROTO_KEYS.NEXT || e.key === PROTO_KEYS.HOLD) ensureProtocolFilled();
});
// ============= final do listener de sincronização =============



/* =========================================================
   [SEÇÃO 11] MOTIVO AO DESMARCAR SERVIÇO (MODAL)
   - Abre/fecha modal
   - Persiste motivo no serviço
   - Re-renderiza cards
========================================================= */

// ============= estado: unselect pendente =============
let pendingUnselect = null; // { erp, serviceId, checkboxEl? }
// ============= final do estado =============


// ============= função: openUnselectReasonModal =============
function openUnselectReasonModal(serviceId, checkboxEl) {
  if (!currentErp) return;
  pendingUnselect = { erp: currentErp, serviceId, checkboxEl };

  const s = erpData[currentErp].services.find(x => x.id === serviceId);
  document.getElementById('unselectReasonText').value = s?.unselectedReason || '';

  document.getElementById('unselectReasonModal').classList.add('show');
  setTimeout(() => document.getElementById('unselectReasonText').focus(), 0);
}
// ============= final da função openUnselectReasonModal =============


// ============= função: closeUnselectReasonModal =============
function closeUnselectReasonModal() {
  document.getElementById('unselectReasonModal').classList.remove('show');
  pendingUnselect = null;
}
// ============= final da função closeUnselectReasonModal =============


// ============= função: saveUnselectReason (grava motivo e desmarca) =============
function saveUnselectReason() {
  if (!pendingUnselect) return;
  const { erp, serviceId } = pendingUnselect;

  const s = erpData[erp].services.find(x => x.id === serviceId);
  if (!s) return;

  s.unselectedReason = (document.getElementById('unselectReasonText').value || '').trim();
  s.checked = false;

  saveData();
  loadServices(erp);
  closeUnselectReasonModal();
  showNotification('Motivo salvo e serviço desmarcado.', 'success');
}
// ============= final da função saveUnselectReason =============


// ======= Ícones desenhados (independentes de fonte) =======
function crossIcon(size = 11, color = THEME.warn) {
  const t = size;
  return {
    canvas: [
      { type: 'line', x1: 0, y1: 0,   x2: t, y2: t, lineWidth: 2, lineColor: color, lineCap:'round' },
      { type: 'line', x1: 0, y1: t,   x2: t, y2: 0, lineWidth: 2, lineColor: color, lineCap:'round' }
    ],
    width: t + 2, height: t
  };
}

function serviceWarnTitleRow(text) {
  return {
    table: { widths: [14, '*'], body: [[ crossIcon(11, THEME.warn), { text, style: 'h3warn', margin: [6, 0, 0, 0] } ]] },
    layout: 'noBorders'
  };
}



/* =========================================================
   [SEÇÃO 12] HELPERS GERAIS (busca chips)
========================================================= */

// ============= função: norm (remove acentos p/ busca) =============
function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
// ============= final da função norm =============


// ============= função: filterPresetChips (filtra chips por texto) =============
function filterPresetChips(query) {
  const q = norm(query);
  let visible = 0;
  document.querySelectorAll('#presetServiceChips .chip-btn').forEach(btn => {
    const show = !q || norm(btn.textContent).includes(q);
    btn.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  const empty = document.getElementById('chipNoResults');
  if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
}
// ============= final da função filterPresetChips =============


// ============= função: debounce (controle de digitação) =============
function debounce(fn, delay=80) {
  let t; 
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}
// ============= final da função debounce =============
