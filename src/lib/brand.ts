// Identidade do cliente deste painel. O mesmo código atende outros clientes
// trocando só este arquivo, as cores (tailwind.config.js / palette.ts) e as
// configurações das pesquisas (src/surveys).

export const APP_CLIENT = "senac" as const

export const BRAND = {
  name: "Senac",
  logo: "/logo_senac.webp",
  logoAlt: "Senac",
  survey: "Reputação & Imagem",
  year: "2026",
  storagePrefix: "senac-dash",
  loginPlaceholder: "ex.: senac-sp",
  tagline:
    "A opinião da população brasileira e dos empresários do comércio, serviços e turismo sobre o Senac, com a visão do Brasil, da sua região e do seu estado.",
  stats: [
    ["5.549", "entrevistas com a população"],
    ["1.000", "empresários do comércio, serviços e turismo"],
    ["27", "unidades da federação"],
  ] as [string, string][],
}
