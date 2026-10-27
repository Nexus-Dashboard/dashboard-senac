// Dicionário de rótulos. A base vem dos dicionários do SPSS (JSON gerado por
// scripts/build-dictionary.mjs); aqui ficam só as exceções que eles não
// cobrem, conferidas contra o questionário e o relatório.

import populacaoJson from "./populacao.json"
import empresariosJson from "./empresarios.json"

interface VariableEntry {
  label: string
  instruction?: string
  values: Record<string, string>
}

export interface Dictionary {
  variables: Record<string, VariableEntry>
  /** coluna da base -> nome da variável no dicionário */
  aliases: Record<string, string>
}

function build(json: { variables: Record<string, VariableEntry> }, aliases: Record<string, string> = {}): Dictionary {
  return { variables: structuredClone(json.variables), aliases }
}

export const INSTITUTIONS = ["Senac", "Senai", "Sebrae", "Estácio", "Uninter", "Descomplica", "Udemy", "Anhanguera"]

// ---------------------------------------------------------------- População

export const populacaoDictionary = build(populacaoJson)

// PF13 8: o rótulo do SPSS junta duas opções com " | "
populacaoDictionary.variables.PF13.values["8"] = "Religioso sem religião definida / Agnóstico"

// ---------------------------------------------------------------- Empresários

export const empresariosDictionary = build(empresariosJson)
const emp = empresariosDictionary.variables

// Nas grades do questionário dos Empresários o dicionário traz só o enunciado.
// Os itens abaixo vêm do questionário (v5), na ordem das colunas.
const setItems = (prefix: string, labels: string[]) =>
  labels.forEach((label, index) => {
    const variable = emp[`${prefix}${index + 1}`]
    if (variable) variable.label = label
  })

// P3 (conhecimento) e P4 (confiança): mesmas 8 instituições da População
setItems("P3_", INSTITUTIONS)
setItems("P4_", INSTITUTIONS)

setItems("P9_1_", [
  "Cursos e treinamentos profissionais",
  "Consultoria e diagnóstico para empresas",
  "Soluções de tecnologia e inovação aplicada ao negócio",
  "Uso de inteligência artificial em educação e processos",
  "Pesquisa e dados sobre o setor de comércio, serviços e turismo",
  "Aceleração de startups e conexão com ecossistema de inovação",
])

// P9_1..P9_4: importância (mesmos três primeiros itens da População + o negócio)
emp.P9_1.label = "O desenvolvimento da população geral e dos cidadãos"
emp.P9_2.label = "A formação de mão de obra qualificada para o mercado de trabalho"
emp.P9_3.label = "O crescimento e competitividade das empresas do comércio, serviços e turismo"
emp.P9_4.label = "O desenvolvimento dos seus negócios"

// P10_1..19: mesmos atributos (e ordem) de T_P13_1..19 da População
for (let k = 1; k <= 19; k++) emp[`P10_${k}`].label = populacaoDictionary.variables[`T_P13_${k}`].label

setItems("P20_", [
  "Turmas presenciais customizadas e fechadas dentro das empresas",
  "Cursos e treinamentos corporativos 100% a distância (EAD)",
  "Cursos livres e de curta duração para rápida atualização da equipe",
  "Cursos técnicos para formação operacional de funcionários",
  "Graduação e pós-graduação voltadas ao ambiente de negócios",
  "Encaminhamento de jovens pelo programa Jovem Aprendiz",
  "Consultoria corporativa para diagnóstico de equipes",
  "Transformação digital e inovação aplicada ao negócio",
  "Pesquisa aplicada e inteligência de mercado do setor",
])

// Rótulo cortado no dicionário
emp.P1_1_CAT.values["8"] = "Resposta não institucional / inválida"

// ---------------------------------------------------------------- acesso

function entry(dictionary: Dictionary, column: string) {
  return dictionary.variables[dictionary.aliases[column] ?? column]
}

export function valueLabel(dictionary: Dictionary, column: string, code: number) {
  return entry(dictionary, column)?.values[String(code)] ?? `Código ${code}`
}

export function variableLabel(dictionary: Dictionary, column: string) {
  return entry(dictionary, column)?.label ?? column
}

export function variableInstruction(dictionary: Dictionary, column: string) {
  return entry(dictionary, column)?.instruction
}

export function valueCodes(dictionary: Dictionary, column: string) {
  return Object.keys(entry(dictionary, column)?.values ?? {})
    .map(Number)
    .sort((a, b) => a - b)
}
