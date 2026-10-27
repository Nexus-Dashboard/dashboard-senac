import clsx from "clsx"
import { int, pct, score } from "../../lib/format"
import { NPS_ZONES, ROLE_COLORS, ROLE_TEXT, npsZoneOf } from "./palette"
import { Legend } from "./StackedBars"
import { TipRow, tipHandlers } from "../ui/Tooltip"

export interface NpsSeries {
  key: string
  label: string
  short: string
  color: string
  promoters: number
  passives: number
  detractors: number
  nps: number
  n: number
}

const PARTS = [
  { key: "detractors", label: "Detratores (0 a 6)", role: "neg2" },
  { key: "passives", label: "Neutros (7 e 8)", role: "neu" },
  { key: "promoters", label: "Promotores (9 e 10)", role: "pos2" },
] as const

export function NpsPanel({ series, asTable }: { series: NpsSeries[]; asTable?: boolean }) {
  const multi = series.length > 1

  if (asTable) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-line text-ink-3">
              <th className="py-2 pr-3 font-semibold">Recorte</th>
              {PARTS.map((part) => (
                <th key={part.key} className="px-2 py-2 text-right font-semibold">
                  {part.label}
                </th>
              ))}
              <th className="px-2 py-2 text-right font-semibold">NPS</th>
              <th className="py-2 pl-2 text-right font-semibold">Base</th>
            </tr>
          </thead>
          <tbody>
            {series.map((item) => (
              <tr key={item.key} className="border-b border-line/60">
                <td className="py-1.5 pr-3">{item.label}</td>
                {PARTS.map((part) => (
                  <td key={part.key} className="px-2 py-1.5 text-right tabular-nums">
                    {pct(item[part.key])}
                  </td>
                ))}
                <td className="px-2 py-1.5 text-right font-semibold tabular-nums">{score(item.nps)}</td>
                <td className="py-1.5 pl-2 text-right tabular-nums text-ink-3">{int(item.n)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className={clsx("grid gap-4", multi ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1")}>
        {series.map((item) => {
          const zone = Number.isFinite(item.nps) ? npsZoneOf(item.nps) : null
          return (
            <div key={item.key} className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs font-medium text-ink-3">
                {multi && <span className="h-2 w-2 rounded-full" style={{ background: item.color }} aria-hidden />}
                {item.label}
              </p>
              <p className={clsx("font-bold tabular-nums tracking-tight text-navy-700", multi ? "text-4xl" : "text-6xl")}>{score(item.nps)}</p>
              {zone && (
                <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-plane px-2.5 py-0.5 text-xs font-semibold text-ink ring-1 ring-line">
                  <span className="h-2 w-2 rounded-full" style={{ background: zone.color }} aria-hidden />
                  Zona de {zone.label.toLowerCase()}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="space-y-3">
        <Legend items={PARTS.map((part) => ({ label: part.label, color: ROLE_COLORS[part.role] }))} />
        <div className="@container">
          <div className="grid grid-cols-1 items-center gap-x-3 gap-y-1.5 @md:grid-cols-[minmax(0,max-content)_minmax(0,1fr)]">
            {series.map((item) => (
              <div key={item.key} className="contents">
                <span className="text-left text-[13px] text-ink-2 @md:text-right">{item.short}</span>
                <div className="flex h-7 w-full min-w-0 gap-[2px] overflow-hidden rounded-md">
                  {PARTS.map((part) =>
                    item[part.key] > 0 ? (
                      <div
                        key={part.key}
                        className="flex min-w-0 items-center justify-center text-[11px] font-semibold tabular-nums first:rounded-l-md last:rounded-r-md"
                        style={{ width: `${item[part.key] * 100}%`, background: ROLE_COLORS[part.role], color: ROLE_TEXT[part.role] }}
                        {...tipHandlers(() => (
                          <div className="space-y-1">
                            <p className="font-semibold">{item.label}</p>
                            <TipRow color={ROLE_COLORS[part.role]} label={part.label} value={pct(item[part.key])} />
                            <p className="text-white/60">Base: {int(item.n)} entrevistas</p>
                          </div>
                        ))}
                      >
                        {item[part.key] >= 0.09 ? pct(item[part.key]) : ""}
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex h-3 gap-[2px] overflow-hidden rounded-full">
          {NPS_ZONES.map((zone) => (
            <div key={zone.label} className="flex-1" style={{ background: zone.color }} />
          ))}
        </div>
        <div className="mt-1.5 grid grid-cols-4 text-center text-[10px] leading-tight text-ink-3">
          {NPS_ZONES.map((zone) => (
            <span key={zone.label}>
              <span className="block font-semibold text-ink-2">{zone.label}</span>
              {zone.from} a {Math.min(100, Math.floor(zone.to - 0.01))}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-3">
          NPS = % promotores (notas 9 e 10) − % detratores (0 a 6), ponderado, sem NS/NR. O relatório mostra 64 no total porque esse número foi
          calculado sem ponderação; os valores por segmento do relatório são ponderados, como aqui.
        </p>
      </div>
    </div>
  )
}
