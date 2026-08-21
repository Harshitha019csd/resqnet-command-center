import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  History,
  MessageSquare,
  Network,
  Siren,
  Timer,
  Users,
} from "lucide-react";
import { AppShell, Panel, Stat } from "@/components/resq/AppShell";
import { EmergencyCard } from "@/components/resq/EmergencyCard";
import { COVERAGE_GAPS, INCIDENTS, OPERATOR, RESCUERS, priorityText } from "@/lib/resqnet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Command Dashboard — ResQNet Rescuer" },
      {
        name: "description",
        content:
          "Live SOS triage overview: critical alerts, team availability, mesh coverage gaps and response metrics.",
      },
      { property: "og:title", content: "Command Dashboard — ResQNet Rescuer" },
      {
        property: "og:description",
        content: "Field coordinator overview of active emergencies, teams and mesh health.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const open = INCIDENTS.filter((i) => i.status !== "RESOLVED");
  const critical = open.filter((i) => i.priority === "CRITICAL");
  const unassigned = open.filter((i) => !i.assignedTo);
  const available = RESCUERS.filter((r) => r.status === "AVAILABLE").length;
  const people = open.reduce((a, i) => a + i.people, 0);

  return (
    <AppShell title="Command" subtitle={`${OPERATOR.name} · ${OPERATOR.team} · shift ${OPERATOR.shift}`}>
      <div className="space-y-3">
        <div className="rounded-lg border border-critical bg-critical-dim/25 p-3 shadow-critical">
          <div className="flex items-center gap-2">
            <Siren className="h-4 w-4 shrink-0 text-critical blink" strokeWidth={2.6} />
            <h2 className="text-base font-bold uppercase tracking-wide text-critical">
              {critical.length} critical SOS require action
            </h2>
          </div>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {unassigned.length} unassigned · {people} people affected · oldest{" "}
            {Math.max(...open.map((i) => i.minutesAgo))} min
          </p>
          <Link
            to="/emergencies"
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-sm border border-critical bg-critical px-3 py-2 font-mono text-[10px] font-black tracking-[0.16em] text-critical-foreground"
          >
            TRIAGE QUEUE <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="OPEN SOS" value={open.length} tone="text-critical" />
          <Stat label="PEOPLE AT RISK" value={people} tone="text-warn" />
          <Stat label="TEAMS FREE" value={available} tone="text-safe" />
          <Stat label="AVG RESPONSE" value="38 min" tone="text-mesh" />
        </div>

        <Panel
          title="Priority queue"
          right={
            <Link to="/emergencies" className="font-mono text-[10px] font-bold tracking-[0.12em] text-mesh">
              VIEW ALL
            </Link>
          }
        >
          <div className="space-y-2.5">
            {open.slice(0, 3).map((i) => (
              <EmergencyCard key={i.id} incident={i} />
            ))}
          </div>
        </Panel>

        <Panel title="Quick actions">
          <div className="grid grid-cols-2 gap-2">
            <Quick to="/map" icon={Network} label="LIVE MAP" hint="Victims · teams · nodes" />
            <Quick to="/assignments" icon={ClipboardList} label="ASSIGN" hint="Dispatch a team" />
            <Quick to="/network" icon={Network} label="MESH" hint="Relays & coverage" />
            <Quick to="/history" icon={History} label="HISTORY" hint="Closed incidents" />
          </div>
        </Panel>

        <Panel title="Coverage gaps — blind spots">
          <ul className="space-y-2">
            {COVERAGE_GAPS.map((g) => (
              <li
                key={g.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-sm border border-border bg-panel-2/60 px-2.5 py-2"
              >
                <AlertTriangle className={cn("h-4 w-4", priorityText[g.severity])} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold">{g.area}</div>
                  <div className="truncate font-mono text-[10px] text-muted-foreground">{g.reason}</div>
                </div>
                <span className={cn("font-mono text-[10px] font-bold", priorityText[g.severity])}>
                  {g.severity}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Live comms feed">
          <ul className="space-y-2">
            {INCIDENTS.slice(0, 4).map((i) => (
              <li key={i.id}>
                <Link
                  to="/comms/$id"
                  params={{ id: i.id }}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-sm border border-border bg-panel-2/50 px-2.5 py-2 hover:bg-panel-2"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-mesh" />
                  <div className="min-w-0">
                    <div className="truncate font-mono text-[11px]">“{i.lastMessage}”</div>
                    <div className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground">
                      #{i.id} · {i.victim.name}
                    </div>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 font-mono text-[9px] text-muted-foreground">
                    <Timer className="h-3 w-3" /> {i.lastUpdate}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Team status">
          <ul className="grid gap-2 sm:grid-cols-2">
            {RESCUERS.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-sm border border-border bg-panel-2/50 px-2.5 py-2"
              >
                <Users className="h-3.5 w-3.5 text-active" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold">
                    {r.name} <span className="font-mono text-[10px] text-muted-foreground">{r.id}</span>
                  </div>
                  <div className="truncate font-mono text-[10px] text-muted-foreground">
                    {r.role} · {r.team}
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 font-mono text-[9px] font-bold tracking-[0.1em]",
                    r.status === "AVAILABLE"
                      ? "text-safe"
                      : r.status === "OFF DUTY"
                        ? "text-muted-foreground"
                        : "text-active",
                  )}
                >
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}

function Quick({
  to,
  icon: Icon,
  label,
  hint,
}: {
  to: "/map" | "/assignments" | "/network" | "/history";
  icon: typeof Network;
  label: string;
  hint: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-sm border border-border bg-panel-2/60 px-3 py-2.5 transition-colors hover:border-mesh-dim"
    >
      <Icon className="h-4 w-4 text-mesh" />
      <div className="mt-1.5 font-mono text-[11px] font-black tracking-[0.14em]">{label}</div>
      <div className="truncate font-mono text-[9px] text-muted-foreground">{hint}</div>
    </Link>
  );
}
