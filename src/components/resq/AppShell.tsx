import { Link, useRouterState } from "@tanstack/react-router";
import {
  BatteryMedium,
  ChevronLeft,
  LayoutDashboard,
  Map,
  Network,
  Siren,
  UserCog,
} from "lucide-react";
import type { ReactNode } from "react";
import { ConnectivityBar } from "./ConnectivityBar";
import { OPERATOR } from "@/lib/resqnet";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "COMMAND", icon: LayoutDashboard },
  { to: "/emergencies", label: "SOS", icon: Siren },
  { to: "/map", label: "MAP", icon: Map },
  { to: "/network", label: "MESH", icon: Network },
  { to: "/profile", label: "UNIT", icon: UserCog },
] as const;

export function AppShell({
  title,
  subtitle,
  back,
  actions,
  children,
  flush = false,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  actions?: ReactNode;
  children: ReactNode;
  flush?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-3 pt-2">
          <ConnectivityBar />
          <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 pb-2">
            <div className="flex min-w-0 items-center gap-2">
              {back && (
                <Link
                  to={back}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border border-border bg-panel-2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Back"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              )}
              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold uppercase leading-none tracking-wide">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {actions}
              <div className="hidden items-center gap-1.5 rounded-sm border border-border bg-panel-2 px-2 py-1 sm:flex">
                <BatteryMedium className="h-3.5 w-3.5 text-warn" />
                <span className="font-mono text-[10px] font-bold">{OPERATOR.battery}%</span>
                <span className="font-mono text-[10px] text-muted-foreground">{OPERATOR.id}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className={cn("mx-auto max-w-5xl", flush ? "" : "px-3 py-3")}>{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-panel/95 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-5">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 transition-colors",
                  active ? "text-critical" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <n.icon className="h-4.5 w-4.5" strokeWidth={active ? 2.6 : 2} />
                <span className="font-mono text-[9px] font-bold tracking-[0.12em]">{n.label}</span>
                <span
                  className={cn("h-0.5 w-6 rounded-full", active ? "bg-critical" : "bg-transparent")}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function Panel({
  title,
  right,
  children,
  className,
}: {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("panel", className)}>
      {title && (
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border px-3 py-2">
          <h2 className="truncate font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {title}
          </h2>
          {right}
        </header>
      )}
      <div className="p-3">{children}</div>
    </section>
  );
}

export function Stat({
  label,
  value,
  tone = "",
}: {
  label: string;
  value: ReactNode;
  tone?: string;
}) {
  return (
    <div className="rounded-sm border border-border bg-panel-2/60 px-2.5 py-2">
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className={cn("mt-1 truncate text-sm font-bold", tone)}>{value}</div>
    </div>
  );
}
