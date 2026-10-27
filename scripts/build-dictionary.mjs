// scripts/build-dictionary.mjs
//
// Gera src/surveys/dictionary/<pesquisa>.json a partir dos dicionários (xlsx)
// exportados do SPSS. Os arquivos são lidos na pasta do cliente (um nível
// acima do projeto), sem cópia: nenhuma base ou dicionário entra no repositório.
//
// Uso: npm run dictionary
//
// Os dois dicionários do Senac têm layouts diferentes, então o leitor percorre
// todas as abas guiado pelos títulos das seções:
//   "Variável | Posição | Rótulo ..."  -> informações das variáveis
//   "Valores de variáveis" + "Valor | | Rótulo" -> código e rótulo (a variável
//   só aparece na primeira linha de cada bloco)

import { readFile, writeFile, mkdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"
import XLSX from "xlsx"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const CLIENT_DIR = path.resolve(ROOT, "..")
const OUT_DIR = path.join(ROOT, "src", "surveys", "dictionary")

const SOURCES = [
  { id: "populacao", file: "Senac Dash.xlsx" },
  { id: "empresarios", file: "Senac Empresários.xlsx" },
]

function tidy(value) {
  if (value === null || value === undefined) return ""
  return String(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/[\t\r\n ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

// "6a" -> "6", "1,00" -> "1", "99,00a" -> "99", 3 -> "3"
function normalizeCode(raw) {
  const match = /^(\d+)/.exec(tidy(raw))
  return match ? String(Number(match[1])) : null
}

const NS_NR = "NS/NR"

// Instruções ao entrevistador entre parênteses, em caixa alta
const INSTRUCTION =
  /\s*\((?=[^)]*(?:NÃO LER|NAO LER|N[ÃA]O LER|AGRADE[ÇC]A|ENCERRE|ACEITAR|ANOT|PROGRAMA|ENTREVISTADOR|ROD[ÍI]ZIO|LER ITENS|SOMENTE))[^)]*\)/g

function cleanValueLabel(raw) {
  let label = tidy(raw).replace(/\s*\(n[ãa]o ler\)/gi, "").replace(INSTRUCTION, "").trim()
  if (/^(n[ãa]o sabe\s*\/\s*n[ãa]o respondeu|ns\s*\/\s*nr|n[ãa]o sabe|n[ãa]o sabe\s*\/\s*n[ãa]o opinou)$/i.test(label)) return NS_NR
  if (/^prefere não responder\s*\/\s*não respondeu$/i.test(label)) return "Prefere não responder"
  if (/^outr[oa]s?\b.*(especifi|quais|anot)/i.test(label)) return "Outros"
  label = label.replace(/^Muita importante$/i, "Muito importante")
  label = label.replace(/:_+$/, "").replace(/_{3,}/g, "").trim()
  return label
}

// "PF1. Qual é a sua posição na empresa? (ESTIMULADA E ÚNICA)" -> { text, instruction }
function splitQuestionLabel(raw) {
  let text = tidy(raw)
  if (!text || text === "<none>") return { text: "", instruction: "" }
  text = text.replace(/^[A-Z]{1,3}\d+[\w.]*\s+-\s+/, "")
  text = text.replace(/^(?:[A-Z]{1,4})?\d+(?:\.\d+)*\.?\s+(?=\S)/, "")
  let instruction = ""
  const match = /\s*\(((?:ESTIMULADA|ESPONT[ÂA]NEA|RU|RM)\b[^)]*)\)\s*$/i.exec(text)
  if (match) {
    instruction = match[1]
    text = text.slice(0, match.index).trim()
  }
  text = text.replace(INSTRUCTION, "").replace(/:$/, "").trim()
  return { text, instruction }
}

async function readCodebook(file) {
  const workbook = XLSX.read(await readFile(path.join(CLIENT_DIR, file)), { type: "buffer" })
  const rows = workbook.SheetNames.flatMap((name) =>
    XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1, defval: null, raw: true }),
  )

  const variables = {}
  let mode = "none"
  let current = null

  for (const row of rows) {
    const first = tidy(row[0])

    if (/^Vari[áa]vel$/i.test(first)) {
      mode = "variables"
      continue
    }
    if (/^Valores de vari[áa]veis/i.test(first)) {
      mode = "values-header"
      continue
    }
    if (mode === "values-header" && /^Valor$/i.test(first)) {
      mode = "values"
      current = null
      continue
    }
    if (/^Vari[áa]veis no arquivo|^Informa[çc][õo]es/i.test(first)) {
      mode = "none"
      continue
    }

    if (mode === "variables") {
      if (!first || !/^\d/.test(tidy(row[1]))) continue
      const rawLabel = tidy(row[2])
      const { text, instruction } = splitQuestionLabel(rawLabel)
      variables[first] = {
        position: Number(tidy(row[1]).replace(",", ".")) || null,
        label: text,
        ...(instruction ? { instruction } : {}),
        rawLabel,
        values: {},
      }
    }

    if (mode === "values") {
      // Rodapé do SPSS ("a. Valor omisso") encerra a lista
      if (/^[a-z]\.\s/.test(first) && !tidy(row[1])) {
        mode = "none"
        continue
      }
      if (first) {
        current = first
        if (!variables[current]) variables[current] = { position: null, label: "", rawLabel: "", values: {} }
      }
      if (!current) continue
      const code = normalizeCode(row[1])
      const label = tidy(row[2])
      if (code === null || !label) continue
      variables[current].values[code] = cleanValueLabel(label)
    }
  }

  return variables
}

await mkdir(OUT_DIR, { recursive: true })

for (const source of SOURCES) {
  const variables = await readCodebook(source.file)
  const output = { survey: source.id, source: source.file, generatedAt: new Date().toISOString(), variables }
  const target = path.join(OUT_DIR, `${source.id}.json`)
  await writeFile(target, JSON.stringify(output, null, 2) + "\n", "utf8")
  const withValues = Object.values(variables).filter((variable) => Object.keys(variable.values).length).length
  console.log(`✔ ${source.id}: ${Object.keys(variables).length} variáveis (${withValues} com rótulos de valor) -> ${path.relative(ROOT, target)}`)
}
