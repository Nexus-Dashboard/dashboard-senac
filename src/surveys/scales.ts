import type { IndexDef, NpsDef, OptionGroup, Scale, TopBox } from "./types"

// Escalas de 5 pontos + NS/NR (códigos 1..6 do dicionário, 1 = mais positivo)
const FIVE_PLUS_NS: Scale = { codes: [1, 2, 3, 4, 5, 6], roles: ["pos2", "pos1", "neu", "neg1", "neg2", "ns"] }
// 4 pontos + NS/NR (códigos 1..5): muita / alguma / pouca / nenhuma
const FOUR_PLUS_NS: Scale = { codes: [1, 2, 3, 4, 5], roles: ["pos2", "pos1", "neg1", "neg2", "ns"] }

export const SCALES = {
  conhecimento: FIVE_PLUS_NS,
  imagem: FIVE_PLUS_NS,
  favorabilidade: FIVE_PLUS_NS,
  confianca: FIVE_PLUS_NS,
  advocacy: FIVE_PLUS_NS,
  importancia: FIVE_PLUS_NS,
  informacao: FIVE_PLUS_NS,
  qualidade: FIVE_PLUS_NS,
  comparacao: FIVE_PLUS_NS,
  quatroPontos: FOUR_PLUS_NS,
  /** Muito / Algum / Pouco ou nenhum interesse + NS/NR */
  interesse: { codes: [1, 2, 3, 4], roles: ["pos2", "pos1", "neg2", "ns"] } as Scale,
  /** Concordância 1-5 + NS/NR (6), exibida de "concorda" para "discorda" */
  concordancia: { codes: [5, 4, 3, 2, 1, 6], roles: ["pos2", "pos1", "neu", "neg1", "neg2", "ns"] } as Scale,
  /** Sim / Não / NS/NR */
  simNao: { codes: [1, 2, 3], roles: ["pos1", "neg1", "ns"] } as Scale,
  /** Presencial × EAD: comparação nominal, sem valência */
  presencialEad: {
    codes: [1, 2, 3, 4],
    roles: ["neu", "neu", "ns", "ns"],
    colors: ["#005594", "#E0761A", "#C4CBD3", undefined],
  } as Scale,
  /** P20 Empresários: conhece × interesse */
  conheceInteresse: {
    codes: [1, 3, 2, 4, 5],
    roles: ["pos2", "pos1", "neu", "neg2", "ns"],
  } as Scale,
}

export const TOP_BOX = {
  conhecimento: { label: "Alto conhecimento", codes: [1, 2] },
  imagem: { label: "Imagem positiva", codes: [1, 2] },
  favorabilidade: { label: "Favoráveis", codes: [1, 2] },
  confianca: { label: "Alta confiança", codes: [1, 2] },
  advocacy: { label: "Promotores", codes: [1, 2] },
  importancia: { label: "Alta importância", codes: [1, 2] },
  informacao: { label: "Informados", codes: [1, 2] },
  qualidade: { label: "Ótima + boa", codes: [1, 2] },
  melhor: { label: "EAD melhor", codes: [1, 2] },
  diferenca: { label: "Faz diferença", codes: [1, 2] },
  provavel: { label: "Provável", codes: [1, 2] },
  importanciaCertificado: { label: "Muita + alguma", codes: [1, 2] },
  interesse: { label: "Tem interesse", codes: [1, 2] },
  concordancia: { label: "Concorda (4+5)", codes: [4, 5] },
  sim: { label: "Sim", codes: [1] },
  interesseEmpresa: { label: "Tem interesse", codes: [1, 3] },
} satisfies Record<string, TopBox>

/** Grupos de conhecimento usados no relatório */
export const KNOWLEDGE_GROUPS: OptionGroup[] = [
  { key: "alto", label: "Alto (conhece muito bem / bem)", codes: [1, 2] },
  { key: "algum", label: "Conhece um pouco", codes: [3] },
  { key: "baixo", label: "Baixo (só de ouvir falar / nada)", codes: [4, 5] },
  { key: "ns", label: "NS/NR", codes: [6] },
]

const range = (prefix: string, from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}`)

// Indicador de Reputação & Imagem. Nota por item: 4-5 -> 1; 3 -> 0,5; 1, 2 e
// NS/NR -> 0. Fórmulas conferidas linha a linha contra a base e o relatório.
const ITEM_SCORES = { 3: 0.5, 4: 1, 5: 1 }

const DIMENSIONS = [
  { label: "Gestão, governança e confiança", items: [1, 3], weight: 0.103 },
  { label: "Impacto social e cidadania", items: [4, 5], weight: 0.151 },
  { label: "Excelência em produtos e serviços", items: [6, 9], weight: 0.125 },
  { label: "Educação a distância (EAD)", items: [10, 11], weight: 0.168 },
  { label: "Comunicação e relacionamento", items: [12, 14], weight: 0.118 },
  { label: "Futuro do trabalho e inovação", items: [15, 19], weight: 0.335 },
]

/** População: soma das 6 dimensões ponderadas pela importância declarada dos temas (P13_1) */
export const INDEX_POPULACAO: IndexDef = {
  dims: DIMENSIONS.map((dim) => ({ label: dim.label, columns: range("T_P13_", dim.items[0], dim.items[1]), weight: dim.weight })),
  itemScores: ITEM_SCORES,
  combine: "weightedDims",
}

/** Empresários: média simples dos 19 atributos (P10) */
export const INDEX_EMPRESARIOS: IndexDef = {
  dims: DIMENSIONS.map((dim) => ({ label: dim.label, columns: range("P10_", dim.items[0], dim.items[1]) })),
  itemScores: ITEM_SCORES,
  combine: "equalItems",
}

/** NPS dos Empresários: P11_2, código k = nota k-1; 12 = NS/NR */
export const NPS_EMPRESARIOS: NpsDef = { column: "P11_2", offset: 1, excludeCodes: [12] }
