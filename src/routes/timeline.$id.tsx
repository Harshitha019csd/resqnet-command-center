import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Clock, Radio, User } from "lucide-react";
import { AppShell, Panel, Stat } from "@/components/resq/AppShell";
import { STATUS_FLOW, getIncident, statusTone } from "@/lib/resqnet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timeline/$id")({
  head: () => ({
    meta: [
      { title: "Incident Status Timeline — ResQNet Rescuer Console" },
      {
        name: "description",
        content:
          "Auditable status trail for an off-grid rescue: SOS receipt, acknowledgement, dispatch, arrival and resolution with mesh sync state.",
      },
      { property: "og:title", content: "Incident Status Timeline — ResQNet Rescuer Console" },
      {
        property: "og:description",
        content: "Chronological audit trail of every status change on a rescue incident.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TimelinePage,
});

function TimelinePage() {
  const { id } = Route.useParams();
  const incident = getIncident(id);

  if (!incident) {
    return (
      <AppShell title="Unknown Timeline" subtitle="record not cached" back="/emergencies">
        <Panel title="Not found">
          <p className="font-mono text-xs text-muted-foreground">
            No audit trail cached for incident #{id}.
          </p>
        </Panel>
      </AppShell>
    );
  }

  const doneIndex = STATUS_FLOW.indexOf(incident.status);
  const logged = new Map(incident.timeline.map((t) => [t.status, t]));

  return (
    <AppShell
      title="Status Timeline"
      subtitle={`SOS #${incident.id} · ${incident.type}`}
      back={`/emergency/${incident.id}`}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Current" value={incident.status} tone={statusTone(incident.status)} />
          <Stat label="Received" value={incident.receivedAt} />
          <Stat label="Elapsed" value={`${incident.minutesAgo} min`} tone="text-warn" />
          <Stat
            label="Steps done"
            value={`${doneIndex + 1}/${STATUS_FLOW.length}`}
            tone="text-active"
          />
        </div>

        <Panel title="Audit trail">
          <ol className="relative space-y-0 pl-1">
            {STATUS_FLOW.map((s, idx) => {
              const entry = logged.get(s);
              const done = idx <= doneIndex;
              const current = idx === doneIndex;
              return (
                <li key={s} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                  <div className="flex flex-col items-center">
                    {done ? (
                      <CheckCircle2
                        className={cn(
                          "h-4 w-4 shrink-0",
                          current ? "text-critical" : "text-safe",
                        )}
                      />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                    )}
                    {idx < STATUS_FLOW.length - 1 && (
                      <span
                        className={cn(
                          "my-0.5 w-px flex-1",
                          idx < doneIndex ? "bg-safe/50" : "bg-border",
                        )}
                      />
                    )}
                  </div>
                  <div className={cn("pb-4", !done && "opacity-50")}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-black tracking-[0.12em]">
                        {s}
                      </span>
                      {current && (
                        <span className="rounded-sm border border-critical bg-critical/15 px-1.5 py-0.5 font-mono text-[9px] font-black tracking-[0.12em] text-critical">
                          CURRENT
                        </span>
                      )}
                    </div>
                    {entry ? (
                      <div className="mt-1 flex flex-wrap items-center gap-3 font-mono text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {entry.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> {entry.by}
                        </span>
                      </div>
                    ) : (
                      <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                        pending
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </Panel>

        <Panel title="Sync state">
          <div className="flex items-start gap-2 font-mono text-[11px] text-muted-foreground">
            <Radio className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mesh" />
            <p>
              Trail written to local node store. Relay path {incident.route.join(" → ")}. Entries
              replicate to command gateway when a link is available — no internet required.
            </p>
          </div>
          <Link
            to="/comms/$id"
            params={{ id: incident.id }}
            className="mt-3 block rounded-sm border border-border bg-panel-2 px-3 py-2 text-center font-mono text-[10px] font-black tracking-[0.14em] text-foreground"
          >
            VIEW MESSAGE LOG
          </Link>
        </Panel>
      </div>
    </AppShell>
  );
}
