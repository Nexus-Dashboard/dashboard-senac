import { populacao } from "./populacao"
import { empresarios } from "./empresarios"
import type { SurveyConfig } from "./types"

export const SURVEYS: Record<SurveyConfig["id"], SurveyConfig> = { populacao, empresarios }
export const SURVEY_ORDER: SurveyConfig["id"][] = ["populacao", "empresarios"]

export function getSurveyConfig(id: string | undefined): SurveyConfig | null {
  return id && id in SURVEYS ? SURVEYS[id as SurveyConfig["id"]] : null
}
