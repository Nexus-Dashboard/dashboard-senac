import clsx from "clsx"
import { LogOut, ShieldCheck, X } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth, isAdmin } from "../../lib/auth/AuthContext"
import { SURVEYS, SURVEY_ORDER } from "../../surveys"
import type { SurveyConfig } from "../../surveys/types"
import { UF_LABELS } from "../../lib/geo"
import { useView } from "../../view/ViewContext"
import { BRAND } from "../../lib/brand"

export function BrandLogo({ className }: { className?: string }) {
  // Logo colorido do cliente: usado sempre sobre fundo claro
  return <img src={BRAND.logo} alt={BRAND.logoAlt} className={className} />
}

export function Sidebar({
  config,
  sectionId,
  onNavigate,
  onClose,
}: {
  config: SurveyConfig | null
  sectionId?: string
  onNavigate?: () => void
  onClose?: () => void
}) {
  const { session, logout } = useAuth()
  const view = useView()
  const navigate = useNavigate()
  const admin = isAdmin(session)

  const goToSurvey = (id: SurveyConfig["id"]) => {
    const target = SURVEYS[id]
    const section = target.sections.find((item) => item.id === sectionId) ?? target.sections[0]
    navigate(`/${id}/${section.id}`)
    onNavigate?.()
  }

  const visibleSections = (config?.sections ?? []).filter(
    (section) => !section.audience || view.audience === "compare" || Number(view.audience) === section.audience,
  )

  const navItem = (isActive: boolean) =>
    clsx(
      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
      isActive ? "bg-navy-700/[0.08] font-semibold text-navy-700 ring-1 ring-navy-700/15" : "text-ink-2 hover:bg-plane hover:text-ink",
    )

  return (
    <aside className="flex h-full w-72 flex-col border-r border-line bg-white">
      <div className="flex items-start justify-between gap-2 px-6 pb-5 pt-6">
        <div>
          <BrandLogo className="h-14 w-auto" />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange-deep">
            {BRAND.survey} · {BRAND.year}
          </p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-ink-3 hover:bg-plane hover:text-ink lg:hidden" aria-label="Fechar menu">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="px-4">
        <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-3">Pesquisa</p>
        <div className="grid gap-1 rounded-xl bg-plane p-1 ring-1 ring-line" style={{ gridTemplateColumns: `repeat(${SURVEY_ORDER.length}, minmax(0, 1fr))` }}>
          {SURVEY_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => goToSurvey(id)}
              className={clsx(
                "rounded-lg px-2 py-2 text-xs font-semibold transition",
                config?.id === id ? "bg-navy-700 text-white shadow" : "text-ink-2 hover:bg-white hover:text-ink",
              )}
            >
              {SURVEYS[id].short}
            </button>
          ))}
        </div>
      </div>

      <nav className="mt-5 flex-1 overflow-y-auto px-4 pb-4" aria-label="Seções">
        <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-3">Seções</p>
        <ul className="space-y-0.5">
          {visibleSections.map((section, index) => {
            const Icon = section.icon
            return (
              <li key={section.id}>
                <NavLink to={`/${config!.id}/${section.id}`} onClick={onNavigate} className={({ isActive }) => navItem(isActive)}>
                  {({ isActive }) => (
                    <>
                      <span className={clsx("text-[10px] font-bold tabular-nums", isActive ? "text-brand-orange-deep" : "text-ink-3")}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span className="leading-tight">{section.title}</span>
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>

        {admin && (
          <>
            <p className="px-2 pb-2 pt-6 text-[10px] font-semibold uppercase tracking-widest text-ink-3">Administração</p>
            <NavLink to="/admin/usuarios" onClick={onNavigate} className={({ isActive }) => navItem(isActive)}>
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Gestão de acessos
            </NavLink>
          </>
        )}
      </nav>

      <div className="border-t border-line px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-plane px-3 py-2.5 ring-1 ring-line">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white">
            {session?.user.uf ?? "NX"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{session?.user.name}</p>
            <p className="truncate text-[11px] text-ink-3">
              {admin ? "Administrador Nexus" : `${session?.user.identity} · ${UF_LABELS[session?.user.uf ?? ""] ?? ""}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="rounded-lg p-2 text-ink-3 transition hover:bg-white hover:text-ink"
            title="Sair"
            aria-label="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-ink-3">
          powered by
          <span className="rounded bg-navy-950 px-2 py-1">
            <img src="/logo-nexus.png" alt="Nexus" className="h-3 w-auto" />
          </span>
        </div>
      </div>
    </aside>
  )
}
