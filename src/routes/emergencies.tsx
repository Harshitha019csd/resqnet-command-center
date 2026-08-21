import { createFileRoute } from "@tanstack/react-router";
import { Filter, SortDesc } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell, Panel } from "@/components/resq/AppShell";
import { EmergencyCard } from "@/components/resq/EmergencyCard";
import { INCIDENTS, type Priority } from "@/lib/resqnet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/emergencies")({
  head: () => ({
    meta: [
      { title: "Active Emergencies — ResQNet Rescuer" },
      {
        name: "description",
        content:
          "Triage the live SOS queue by priority, distance and time received across the off-grid mesh.",
      },
      { property: "og:title", content: "Active Emergencies — ResQNet Rescuer" },
      {
        property: "og:description",
        content: "Sortable SOS queue with priority, comms state and people affected.",
      },
    ],
  }),
  component: EmergencyList,
});

const priorities: (Priority | "ALL")[] = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];
const sorts = ["PRIORITY", "NEAREST", "NEWEST", "PEOPLE"] as const;

function EmergencyList() {
  const [prio, setPrio] = useState<Priority | "ALL">("ALL");
  const [sort, setSort] = useState<(typeof sorts)[number]>("PRIORITY");
  const [openOnly, setOpenOnly] = useState(true);

  const rank: Record<Priority, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

  const list = useMemo(() => {
    let l = INCIDENTS.filter((i) => (openOnly ? i.status !== "RESOLVED" : true));
    if (prio !== "ALL") l = l.filter((i) => i.priority === prio);
    return [...l].sort((a, b) => {
      if (sort === "NEAREST") return a.distanceKm - b.distanceKm;
      if (sort === "NEWEST") return a.minutesAgo - b.minutesAgo;
      if (sort === "PEOPLE") return b.people - a.people;
      return rank[a.priority] - rank[b.priority] || a.minutesAgo - b.minutesAgo;
    });
  }, [prio, sort, openOnly]);

  return (
    <AppShell
      title="Active SOS"
      subtitle={`${list.length} alerts in queue · mesh-relayed`}
      back="/dashboard"
    >
      <div className="space-y-3">
        <Panel title="Filters">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <Filter className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            {priorities.map((p) => (
              <button
                key={p}
                onClick={() => setPrio(p)}
                className={cn(
                  "shrink-0 rounded-sm border px-2.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.12em]",
                  prio === p
                    ? "border-critical bg-critical-dim/40 text-critical"
                    : "border-border bg-panel-2 text-muted-foreground",
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1">
            <SortDesc className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            {sorts.map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={cn(
                  "shrink-0 rounded-sm border px-2.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.12em]",
                  sort === s
                    ? "border-mesh bg-mesh-dim/40 text-mesh"
                    : "border-border bg-panel-2 text-muted-foreground",
                )}
              >
                {s}
              </button>
            ))}
            <button
              onClick={() => setOpenOnly((v) => !v)}
              className={cn(
                "ml-auto shrink-0 rounded-sm border px-2.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.12em]",
                openOnly
                  ? "border-safe bg-safe-dim/30 text-safe"
                  : "border-border bg-panel-2 text-muted-foreground",
              )}
            >
              {openOnly ? "OPEN ONLY" : "INCL. RESOLVED"}
            </button>
          </div>
        </Panel>

        <div className="space-y-2.5">
          {list.map((i) => (
            <EmergencyCard key={i.id} incident={i} />
          ))}
          {list.length === 0 && (
            <p className="rounded-lg border border-border bg-panel p-6 text-center font-mono text-[11px] text-muted-foreground">
              NO ALERTS MATCH THIS FILTER
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
