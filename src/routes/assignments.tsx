import { createFileRoute } from "@tanstack/react-router";
import { BatteryMedium, CheckCircle2, Navigation, Radio, UserCheck, Users } from "lucide-react";
import { useState } from "react";
import { AppShell, Panel, Stat } from "@/components/resq/AppShell";
import { INCIDENTS, RESCUERS, priorityClasses, type Rescuer } from "@/lib/resqnet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assignments")({
  head: () => ({
    meta: [
      { title: "Rescue Assignment — ResQNet Rescuer Console" },
      {
        name: "description",
        content:
          "Dispatch the closest available rescue team to an open SOS using offline distance, ETA, skills and device battery data.",
      },
      { property: "og:title", content: "Rescue Assignment — ResQNet Rescuer Console" },
      {
        property: "og:description",
        content: "Match available field teams to open SOS calls over the ResQNet mesh.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssignmentsScreen,
});

const statusTone: Record<Rescuer["status"], string> = {
  AVAILABLE: "text-safe",
  ASSIGNED: "text-active",
  "ON SCENE": "text-mesh",
  "OFF DUTY": "text-muted-foreground",
};

function AssignmentsScreen() {
  const open = INCIDENTS.filter((i) => i.status !== "RESOLVED");
  const [incidentId, setIncidentId] = useState(open[0]?.id ?? "");
  const [dispatched, setDispatched] = useState<string[]>([]);
  const incident = open.find((i) => i.id === incidentId);
  const ranked = [...RESCUERS].sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <AppShell
      title="Rescue assignment"
      subtitle={`${open.length} open SOS · ${RESCUERS.filter((r) => r.status === "AVAILABLE").length} teams available`}
      back="/dashboard"
    >
      <div className="space-y-3">
        <Panel title="1 · Select incident">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {open.map((i) => (
              <button
                key={i.id}
                onClick={() => setIncidentId(i.id)}
                className={cn(
                  "shrink-0 rounded-sm border px-2.5 py-2 text-left",
                  incidentId === i.id ? "border-critical bg-panel-2" : "border-border bg-panel-2/50",
                )}
              >
                <span
                  className={cn(
                    "rounded-[3px] border px-1 py-0.5 font-mono text-[8px] font-black tracking-[0.12em]",
                    priorityClasses[i.priority],
                  )}
                >
                  {i.priority}
                </span>
                <div className="mt-1 font-mono text-[11px] font-bold">#{i.id}</div>
                <div className="font-mono text-[10px] text-muted-foreground">{i.type.split(" · ")[0]}</div>
              </button>
            ))}
          </div>
          {incident && (
            <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              <Stat label="Location" value={incident.locationLabel} />
              <Stat label="People" value={incident.people} tone="text-warn" />
              <Stat label="Status" value={incident.status} tone="text-active" />
              <Stat label="Assigned" value={incident.assignedTo ?? "NONE"} tone="text-critical" />
            </div>
          )}
        </Panel>

        <Panel title="2 · Nearest teams" right={<span className="font-mono text-[10px] text-muted-foreground">sorted by distance</span>}>
          <ul className="space-y-1.5">
            {ranked.map((r) => {
              const done = dispatched.includes(r.id);
              return (
                <li
                  key={r.id}
                  className={cn(
                    "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-sm border px-2.5 py-2",
                    done ? "border-safe bg-safe-dim/20" : "border-border bg-panel-2/60",
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <UserCheck className={cn("h-3.5 w-3.5", statusTone[r.status])} />
                      <span className="truncate text-[12px] font-bold">{r.name}</span>
                      <span className={cn("font-mono text-[9px] tracking-[0.1em]", statusTone[r.status])}>
                        {r.status}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                      {r.id} · {r.role} · {r.team} · {r.skills.join(" / ")}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Navigation className="h-2.5 w-2.5" /> {r.distanceKm} km · {r.etaMin} min
                      </span>
                      <span className={cn("flex items-center gap-1", r.battery < 25 && "text-critical")}>
                        <BatteryMedium className="h-2.5 w-2.5" /> {r.battery}%
                      </span>
                    </p>
                  </div>
                  <button
                    disabled={r.status === "OFF DUTY"}
                    onClick={() => setDispatched((d) => (d.includes(r.id) ? d : [...d, r.id]))}
                    className={cn(
                      "shrink-0 rounded-sm border px-2.5 py-2 font-mono text-[10px] font-black tracking-[0.1em]",
                      r.status === "OFF DUTY"
                        ? "border-border bg-panel text-muted-foreground"
                        : done
                          ? "border-safe bg-safe-dim/40 text-safe"
                          : "border-critical bg-critical text-critical-foreground",
                    )}
                  >
                    {r.status === "OFF DUTY" ? "OFF DUTY" : done ? "DISPATCHED" : "DISPATCH"}
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="3 · Dispatch queue">
          {dispatched.length === 0 ? (
            <p className="font-mono text-[11px] text-muted-foreground">
              No orders queued. Dispatch orders are stored locally and pushed on next mesh contact.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {dispatched.map((id) => (
                <li key={id} className="flex items-center gap-2 rounded-sm border border-safe-dim bg-safe-dim/20 px-2.5 py-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-safe" />
                  <span className="font-mono text-[11px] font-bold">{id}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    → #{incidentId}
                  </span>
                  <span className="ml-auto flex items-center gap-1 font-mono text-[9px] text-mesh">
                    <Radio className="h-3 w-3" /> QUEUED · MESH
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2">
          <Users className="h-3.5 w-3.5 text-mesh" />
          <p className="font-mono text-[10px] text-muted-foreground">
            Assignments propagate rescuer-to-rescuer; the receiving node confirms with a mesh ACK.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
