import { createFileRoute, Link } from "@tanstack/react-router";
import { Archive, CheckCircle2, Clock, Download, Users } from "lucide-react";
import { useState } from "react";
import { AppShell, Panel, Stat } from "@/components/resq/AppShell";
import { INCIDENTS, priorityText, statusTone } from "@/lib/resqnet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Incident History — ResQNet Rescuer Console" },
      {
        name: "description",
        content:
          "Archive of resolved and closed off-grid rescue operations with response times, people assisted and outcomes.",
      },
      { property: "og:title", content: "Incident History — ResQNet Rescuer Console" },
      {
        property: "og:description",
        content: "Closed rescue operations log with response times and outcomes for after-action review.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

const FILTERS = ["ALL", "RESOLVED", "ACTIVE"] as const;

function HistoryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");

  const rows = INCIDENTS.filter((i) =>
    filter === "ALL"
      ? true
      : filter === "RESOLVED"
        ? i.status === "RESOLVED"
        : i.status !== "RESOLVED",
  );

  const resolved = INCIDENTS.filter((i) => i.status === "RESOLVED");
  const peopleAssisted = resolved.reduce((n, i) => n + i.people, 0);
  const responseTimes = resolved
    .map((i) => i.responseMin)
    .filter((n): n is number => typeof n === "number");
  const avgResponse = responseTimes.length
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : 0;

  return (
    <AppShell
      title="Incident History"
      subtitle="local node archive · pending gateway sync"
      back="/dashboard"
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Closed ops" value={resolved.length} tone="text-safe" />
          <Stat label="People assisted" value={peopleAssisted} />
          <Stat label="Avg response" value={`${avgResponse} min`} tone="text-active" />
          <Stat label="Archived total" value={INCIDENTS.length} />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Archive className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 rounded-sm border px-2.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.12em]",
                filter === f
                  ? "border-border bg-panel-2 text-foreground"
                  : "border-border bg-background text-muted-foreground opacity-60",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <Panel title={`Records · ${rows.length}`}>
          <ul className="divide-y divide-border">
            {rows.map((i) => (
              <li key={i.id}>
                <Link
                  to="/emergency/$id"
                  params={{ id: i.id }}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2.5 transition-colors hover:bg-panel-2/50"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-mono text-[10px] font-black tracking-[0.14em]",
                          priorityText[i.priority],
                        )}
                      >
                        {i.priority}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        #{i.id}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-sm font-bold">{i.type}</div>
                    <div className="truncate font-mono text-[10px] text-muted-foreground">
                      {i.locationLabel} · {i.receivedAt}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 font-mono text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {i.people}
                      </span>
                      {typeof i.responseMin === "number" && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {i.responseMin} min
                        </span>
                      )}
                      {i.outcome && (
                        <span className="flex items-center gap-1 text-safe">
                          <CheckCircle2 className="h-3 w-3" /> {i.outcome}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-[10px] font-black tracking-[0.12em]",
                      statusTone(i.status),
                    )}
                  >
                    {i.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {!rows.length && (
            <p className="font-mono text-[11px] text-muted-foreground">
              No records match this filter.
            </p>
          )}
        </Panel>

        <Panel title="Export">
          <p className="font-mono text-[11px] text-muted-foreground">
            After-action report queued locally. Transfers as a signed bundle at the next gateway
            handshake — no internet connection required in the field.
          </p>
          <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-sm border border-border bg-panel-2 px-3 py-2 font-mono text-[10px] font-black tracking-[0.14em] text-foreground">
            <Download className="h-3.5 w-3.5" /> QUEUE AAR EXPORT
          </button>
        </Panel>
      </div>
    </AppShell>
  );
}
