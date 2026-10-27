import { Briefcase, Eye, Gauge, HeartHandshake, LayoutDashboard, MonitorSmartphone, Sparkles, ThumbsUp } from "lucide-react"
import { INSTITUTIONS, empresariosDictionary } from "./dictionary"
import { INDEX_EMPRESARIOS, KNOWLEDGE_GROUPS, NPS_EMPRESARIOS, SCALES, TOP_BOX } from "./scales"
import type { OptionGroup, SurveyConfig } from "./types"

const range = (prefix: string, from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}`)

const Q_CONHECIMENTO =
  "Vou citar o nome de algumas instituições e gostaria de saber qual é o grau de conhecimento que o(a) senhor(a) tem sobre a atuação de cada uma delas."
const Q_CONFIANCA = "O quanto o(a) senhor(a) diria que confia em cada uma dessas instituições?"
const Q_ATRIBUTOS =
  "Agora, vou ler alguns atributos e gostaria que me dissesse o quanto concorda ou discorda que o SENAC possui cada um deles, em uma escala de 1 a 5, em que 1 significa que discorda totalmente e 5 que concorda totalmente."

// Ramos agrupados como no relatório
const RAMOS: OptionGroup[] = [
  { key: "varejo", label: "Varejista / Armazenador", codes: [4, 2] },
  { key: "servicos", label: "Prestação de serviço / Autônomos", codes: [5, 1] },
  { key: "atacado", label: "Atacadista", codes: [3] },
  { key: "turismo", label: "Turismo e hospitalidade", codes: [6] },
]

export const empresarios: SurveyConfig = {
  id: "empresarios",
  apiId: "senac-empresarios",
  title: "Empresários",
  short: "Empresários",
  description: "1.000 entrevistas ponderadas (861 casos) com empresas do comércio de bens, serviços e turismo.",
  dictionary: empresariosDictionary,
  sampleNote:
    "Entrevistas por telefone (17/08 a 25/09/2026) com decisores de empresas pequenas e médias/grandes. Resultados ponderados (porte × região, base ponderada 1.000). Por estado as bases são pequenas e Roraima não teve entrevista: leia com cautela.",

  filters: [
    { id: "porte", label: "Porte da empresa", column: "tamanho_cotas" },
    { id: "ramo", label: "Ramo de atividade", column: "DUMCota_CNAE", groups: RAMOS },
    { id: "cargo", label: "Cargo do entrevistado", column: "PF1" },
    { id: "sexo", label: "Sexo", column: "PF9" },
    { id: "conhecimento", label: "Conhecimento do Senac", column: "P3_1", groups: KNOWLEDGE_GROUPS },
    { id: "relacionamento", label: "Relacionamento com o Senac", column: "P13", hideCodes: [3] },
  ],

  breakdowns: [
    { id: "porte", label: "Porte", column: "tamanho_cotas" },
    { id: "ramo", label: "Ramo", column: "DUMCota_CNAE", groups: RAMOS },
    { id: "conhecimento", label: "Conhecimento do Senac", column: "P3_1", groups: KNOWLEDGE_GROUPS.slice(0, 3) },
    { id: "relacionamento", label: "Relacionamento com o Senac", column: "P13", hideCodes: [3] },
    { id: "regiao", label: "Região", special: "region" },
  ],

  sections: [
    {
      id: "visao-geral",
      title: "Visão geral",
      description: "Os principais indicadores de reputação do Senac entre os empresários no recorte selecionado.",
      icon: LayoutDashboard,
      kpis: [
        { id: "indicador", label: "Indicador R&I", hint: "Índice de 0 a 100", metric: { kind: "index", index: INDEX_EMPRESARIOS } },
        { id: "nps", label: "NPS", hint: "Promotores − detratores", metric: { kind: "nps", nps: NPS_EMPRESARIOS } },
        { id: "imagem", label: "Imagem positiva", hint: "Muito + um pouco positiva", metric: { kind: "share", column: "P8", codes: [1, 2] } },
        { id: "confianca", label: "Alta confiança", hint: "Confia totalmente + parcialmente", metric: { kind: "share", column: "P4_1", codes: [1, 2] } },
        { id: "conhece-bem", label: "Alto conhecimento", hint: "Conhece muito bem + bem", metric: { kind: "share", column: "P3_1", codes: [1, 2] } },
        { id: "tom", label: "Top of mind", hint: "Senac citado espontaneamente em 1º", metric: { kind: "share", column: "P1_1_CAT", codes: [15] } },
        { id: "relacionamento", label: "Já se relacionou", hint: "Empresa teve contato com o Senac", metric: { kind: "share", column: "P13", codes: [1] } },
        { id: "estrategico", label: "Força estratégica", hint: "Vê o Senac como parceiro estratégico", metric: { kind: "share", column: "P11", codes: [1] } },
      ],
      questions: [
        {
          kind: "index",
          id: "indicador-geral",
          code: "P10",
          title: "Indicador de Reputação & Imagem",
          question: "Média dos 19 atributos de concordância (escala 1 a 5): notas 4 e 5 valem 1,0 e nota 3 vale 0,5; padronizado de 0 a 100.",
          index: INDEX_EMPRESARIOS,
          wide: true,
        },
        { kind: "single", id: "estrategico-geral", code: "P11", title: "Como o empresário enxerga o Senac", column: "P11", display: "rank", sort: false },
        {
          kind: "single",
          id: "imagem-geral",
          code: "P8",
          title: "Percepção de imagem do Senac",
          column: "P8",
          display: "stack",
          scale: SCALES.imagem,
          topBox: TOP_BOX.imagem,
        },
      ],
    },

    {
      id: "perfil",
      title: "Perfil da amostra",
      description: "Perfil das empresas e dos entrevistados no recorte, com os resultados ponderados.",
      icon: Briefcase,
      questions: [
        { kind: "single", id: "porte", code: "Porte", title: "Porte da empresa", column: "tamanho_cotas", display: "rank", sort: false },
        { kind: "single", id: "funcionarios", code: "PF3", title: "Número de funcionários", column: "PF3", display: "rank", sort: false },
        { kind: "single", id: "ramo", code: "CNAE", title: "Ramo de atividade", column: "DUMCota_CNAE", display: "rank" },
        { kind: "single", id: "cargo", code: "PF1", title: "Cargo do entrevistado", column: "PF1", display: "rank" },
        { kind: "single", id: "sexo", code: "PF9", title: "Sexo do entrevistado", column: "PF9", display: "rank", sort: false },
      ],
    },

    {
      id: "awareness",
      title: "Recall & Awareness",
      description: "Lembrança espontânea, conhecimento, confiança e imagem do Senac entre os empresários.",
      icon: Eye,
      questions: [
        { kind: "single", id: "top-of-mind", code: "P1", title: "Top of mind", column: "P1_1_CAT", display: "rank", highlightCodes: [15] },
        {
          kind: "single",
          id: "imagem",
          code: "P8",
          title: "Imagem do Senac por perfil",
          column: "P8",
          display: "stack",
          scale: SCALES.imagem,
          topBox: TOP_BOX.imagem,
          breakdown: true,
        },
        {
          kind: "grid",
          id: "conhecimento",
          code: "P3",
          title: "Conhecimento das instituições",
          question: Q_CONHECIMENTO,
          instruction: "Estimulada e única por linha",
          columns: range("P3_", 1, 8),
          itemLabels: INSTITUTIONS,
          scale: SCALES.conhecimento,
          topBox: TOP_BOX.conhecimento,
          sort: true,
          highlightColumn: "P3_1",
          wide: true,
        },
        {
          kind: "grid",
          id: "confianca",
          code: "P4",
          title: "Confiança nas instituições",
          question: Q_CONFIANCA,
          instruction: "Estimulada e única por linha",
          columns: range("P4_", 1, 8),
          itemLabels: INSTITUTIONS,
          scale: SCALES.confianca,
          topBox: TOP_BOX.confianca,
          sort: true,
          highlightColumn: "P4_1",
          wide: true,
        },
      ],
    },

    {
      id: "associacao",
      title: "Imagem e associação",
      description: "O quanto o empresário associa o Senac a cada área, a importância da instituição e o nível de informação.",
      icon: Sparkles,
      questions: [
        {
          kind: "means",
          id: "associacao",
          code: "P9.1",
          title: "Associação do Senac a áreas de atuação",
          question:
            "Vou citar algumas áreas de atuação. Para cada uma, gostaria que o(a) senhor(a) me dissesse o quanto associa ou não associa ao SENAC, em uma escala de 0 a 10.",
          instruction: "Estimulada e única por linha · média de 0 a 10, sem NS/NR",
          groups: [{ label: "Áreas de atuação", columns: range("P9_1_", 1, 6) }],
          range: { minCode: 1, maxCode: 11, offset: 1 },
          wide: true,
        },
        {
          kind: "grid",
          id: "importancia",
          code: "P9",
          title: "Importância do Senac",
          question: "Na sua opinião, qual o grau de importância do SENAC hoje para...",
          instruction: "Estimulada e única por linha",
          columns: range("P9_", 1, 4),
          scale: SCALES.importancia,
          topBox: TOP_BOX.importancia,
          sort: true,
          wide: true,
        },
        {
          kind: "single",
          id: "informacao",
          code: "P19",
          title: "Nível de informação sobre os serviços",
          column: "P19",
          display: "stack",
          scale: SCALES.informacao,
          topBox: TOP_BOX.informacao,
          breakdown: true,
          wide: true,
        },
      ],
    },

    {
      id: "indicador",
      title: "Índice de reputação",
      description: "Índice de 0 a 100 a partir dos 19 atributos reputacionais, em seis dimensões.",
      icon: Gauge,
      questions: [
        {
          kind: "index",
          id: "indicador",
          code: "P10",
          title: "Indicador de Reputação & Imagem",
          question: "Média dos 19 atributos de concordância (escala 1 a 5): notas 4 e 5 valem 1,0 e nota 3 vale 0,5; padronizado de 0 a 100.",
          index: INDEX_EMPRESARIOS,
          wide: true,
        },
        {
          kind: "means",
          id: "atributos-medias",
          code: "P10",
          title: "Atributos reputacionais: nota média",
          question: Q_ATRIBUTOS,
          instruction: "Estimulada e única por linha · média de 1 a 5, sem NS/NR",
          groups: INDEX_EMPRESARIOS.dims.map((dim) => ({ label: dim.label, columns: dim.columns })),
          wide: true,
        },
        {
          kind: "grid",
          id: "atributos-escala",
          code: "P10",
          title: "Atributos reputacionais: distribuição",
          question: Q_ATRIBUTOS,
          columns: range("P10_", 1, 19),
          scale: SCALES.concordancia,
          topBox: TOP_BOX.concordancia,
          sort: true,
          wide: true,
        },
        {
          kind: "multi",
          id: "temas",
          code: "P11.1",
          title: "Temas mais importantes para a opinião sobre o Senac",
          instruction: "1ª e 2ª menções",
          columns: ["P11_1_1", "P11_1_2"],
          wide: true,
        },
      ],
    },

    {
      id: "nps",
      title: "NPS",
      description: "Probabilidade de o empresário recomendar o Senac, de 0 a 10.",
      icon: ThumbsUp,
      questions: [
        {
          kind: "nps",
          id: "nps",
          code: "P11.2",
          title: "Net Promoter Score",
          nps: NPS_EMPRESARIOS,
          wide: true,
        },
      ],
    },

    {
      id: "relacionamento",
      title: "Relacionamento com o Senac",
      description: "Parcerias e contatos das empresas com o Senac, impacto gerado e soluções corporativas.",
      icon: HeartHandshake,
      questions: [
        {
          kind: "single",
          id: "relacionamento",
          code: "P13",
          title: "A empresa já se relacionou com o Senac",
          column: "P13",
          display: "stack",
          scale: SCALES.simNao,
          topBox: TOP_BOX.sim,
          breakdown: true,
        },
        {
          kind: "checkbox",
          id: "tipos",
          code: "P14",
          title: "Tipos de relacionamento",
          question: "E qual ou quais tipos de relacionamento a sua empresa já teve ou tem com o SENAC?",
          instruction: "Estimulada e múltipla",
          baseNote: "Empresas que já se relacionaram com o Senac",
          columns: ["P14_1", "P14_2", "P14_3", "P14_4", "P14_5", "P14_6", "P14_98"],
          residualColumns: ["P14_6", "P14_98"],
        },
        {
          kind: "single",
          id: "impacto",
          code: "P15",
          title: "Principal impacto gerado para o negócio",
          baseNote: "Empresas que já se relacionaram com o Senac",
          column: "P15_1",
          display: "rank",
          wide: true,
        },
        { kind: "single", id: "prioridade", code: "P19.1", title: "Prioridade para impulsionar a competitividade", column: "P19_1", display: "rank", wide: true },
        {
          kind: "grid",
          id: "solucoes",
          code: "P20",
          title: "Soluções corporativas: conhecimento e interesse",
          question:
            "O SENAC oferece diferentes soluções para o mercado corporativo. Para cada uma, diga o quanto o(a) senhor(a) conhece e o interesse da sua empresa em contratar esse serviço atualmente.",
          instruction: "Estimulada e única por linha",
          columns: range("P20_", 1, 9),
          scale: SCALES.conheceInteresse,
          topBox: TOP_BOX.interesseEmpresa,
          sort: true,
          wide: true,
        },
        { kind: "single", id: "investimento", code: "P21.1", title: "Intenção de investir em qualificação (6 meses)", column: "P21_1", display: "rank", sort: false, wide: true },
      ],
    },

    {
      id: "ensino-digital",
      title: "Ensino digital e posicionamento",
      description: "Formatos de treinamento, barreiras ao EAD, valor do certificado e canais de relacionamento.",
      icon: MonitorSmartphone,
      questions: [
        { kind: "single", id: "formato", code: "P23", title: "Formato preferido para treinar equipes", column: "P23", display: "rank", breakdown: true },
        { kind: "single", id: "barreira", code: "P26", title: "Maior barreira para adotar EAD", column: "P26", display: "rank" },
        {
          kind: "single",
          id: "certificado",
          code: "P27",
          title: "Importância do certificado Senac",
          column: "P27",
          display: "stack",
          scale: SCALES.quatroPontos,
          topBox: TOP_BOX.importanciaCertificado,
          breakdown: true,
        },
        {
          kind: "checkbox",
          id: "canais",
          code: "P31",
          title: "Canais preferidos para receber ofertas",
          question: "Por quais canais de comunicação a sua empresa preferiria receber novidades, ofertas de cursos ou propostas corporativas de instituições como o SENAC?",
          instruction: "Estimulada e múltipla",
          columns: ["P31_1", "P31_2", "P31_3", "P31_4", "P31_5", "P31_6", "P31_7", "P31_91", "P31_97", "P31_99"],
          residualColumns: ["P31_91", "P31_97", "P31_99"],
        },
      ],
    },
  ],
}
