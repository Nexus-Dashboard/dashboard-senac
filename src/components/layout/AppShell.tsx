import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { Outlet, useLocation, useParams } from "react-router-dom"
import clsx from "clsx"
import { getSurveyConfig } from "../../surveys"
import { BrandLogo, Sidebar } from "./Sidebar"

export function AppShell() {
  const { surveyId, sectionId } = useParams()
  const location = useLocation()
  const config = getSurveyConfig(surveyId) ?? getSurveyConfig("populacao")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setMenuOpen(false), [location.pathname])

  return (
    <div className="min-h-screen bg-plane">
      {/* Desktop: menu fixo */}
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar config={config} sectionId={sectionId} />
      </div>

      {/* Mobile: barra superior + menu em gaveta */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white px-4 py-2.5 lg:hidden">
        <BrandLogo className="h-9 w-auto" />
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="rounded-lg p-2 text-ink-2 hover:bg-plane"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <div className={clsx("fixed inset-0 z-50 lg:hidden", menuOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <div
          className={clsx("absolute inset-0 bg-navy-950/50 transition-opacity", menuOpen ? "opacity-100" : "opacity-0")}
          onClick={() => setMenuOpen(false)}
        />
        <div className={clsx("absolute inset-y-0 left-0 transition-transform duration-300", menuOpen ? "translate-x-0" : "-translate-x-full")}>
          <Sidebar config={config} sectionId={sectionId} onNavigate={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)} />
        </div>
      </div>

      <main className="min-w-0 lg:pl-72">
        <Outlet />
      </main>
    </div>
  )
}
