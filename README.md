# Dashboard Senac · Reputação & Imagem 2026

Painel das pesquisas de Reputação & Imagem do Senac: População geral (5.549 casos) e Empresários (861 casos, base ponderada 1.000), com login individual por UF.

Mesma infraestrutura do dashboard do Sesc (`Nexus/Sesc/dashboard-sesc`).

## Como funciona

- **Login:** `/api/clients/auth/*` da API Nexus, com JWT de 8h em `sessionStorage`.
  - No primeiro acesso o usuário é obrigado a trocar a senha provisória.
  - Contas de outro cliente (ex.: `sesc-sp`) são recusadas. O admin da Nexus entra.
- **Dados:** vêm só de `GET /api/clients/surveys/{senac-populacao|senac-empresarios}/data`.
  - A API lê a planilha Google e aplica a máscara de escopo no servidor: o usuário estadual recebe só o marcador Brasil / sua região / seu estado.
  - Contrato em `Nexus/api/docs/CLIENT_SURVEYS.md`.
- **Rótulos:** `npm run dictionary` lê os dicionários do SPSS na pasta do cliente (`../Senac Dash.xlsx`, `../Senac Empresários.xlsx`) e gera `src/surveys/dictionary/*.json`.
  - Nenhuma base, relatório ou dicionário fica dentro deste repositório.
  - Itens que o dicionário não nomeia vêm do questionário, em `src/surveys/dictionary/index.ts`.
- **Cálculos:** `src/data/engine.ts`. Tudo ponderado (`weights.rf` / `weights`); a base exclui brancos e inclui NS/NR.
  - **Indicador da População:** 19 atributos (4–5 = 1; 3 = 0,5) em 6 dimensões, somadas com os pesos de importância dos temas (.103 / .151 / .125 / .168 / .118 / .335).
  - **Indicador dos Empresários:** média simples dos 19 atributos.
  - **NPS ponderado:** o relatório mostra 64 no total sem ponderação; ponderado dá 65,6.
  - Validados contra o relatório: 76,2 (com todos os estados e regiões), 88,4 (com dimensões e portes) e NPS por segmento.
- **Perguntas e seções:** `src/surveys/populacao.ts` e `src/surveys/empresarios.ts`.
- **Marca:** `src/lib/brand.ts`, `tailwind.config.js` e `src/components/charts/palette.ts`.

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # ajuste VITE_API_URL
npm run dev                  # http://localhost:5174
```

Em modo dev, a tela de troca de senha tem o botão "Pular (apenas dev)", para navegar sem gravar senha nas contas reais. Ele não existe no build de produção.

## Publicar (Vercel)

- Build: `npm run build`. Saída: `dist/`.
- Variável: `VITE_API_URL=https://api-nexus-dashboard.vercel.app`.
- `vercel.json` traz o rewrite de SPA e os headers de segurança.
