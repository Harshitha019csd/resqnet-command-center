import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BatteryLow,
  Droplets,
  History,
  Languages,
  MapPin,
  MessageSquare,
  Radio,
  Users,
} from "lucide-react";
import { AppShell, Panel, Stat } from "@/components/resq/AppShell";
import { commsTone, getIncident, priorityText } from "@/lib/resqnet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/victim/$id")({
  head: () => ({
    meta: [
      { title: "Victim Information — ResQNet Rescuer Console" },
      {
        name: "description",
        content:
          "Cached victim profile for off-grid rescue: medical conditions, blood type, languages, device battery and location history.",
      },
      { property: "og:title", content: "Victim Information — ResQNet Rescuer Console" },
      {
        property: "og:description",
        content: "Medical profile, spoken languages and location trail for a victim reached over mesh.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VictimPage,
});

function VictimPage() {
  const { id } = Route.useParams();
  const incident = getIncident(id);

  if (!incident) {
    return (
      <AppShell title="Unknown Victim" subtitle="record not cached" back="/emergencies">
        <Panel title="Not found">
          <p className="font-mono text-xs text-muted-foreground">
            No victim record for incident #{id} on this node.
          </p>
        </Panel>
      </AppShell>
    );
  }

  const v = incident.victim;

  return (
    <AppShell
      title={v.name}
      subtitle={`${v.id} · linked to SOS #${incident.id}`}
      back={`/emergency/${incident.id}`}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Age" value={`${v.age} yrs`} />
          <Stat label="Blood" value={v.bloodType} tone="text-critical" />
          <Stat label="People" value={v.people} />
          <Stat
            label="Device batt"
            value={`${v.battery}%`}
            tone={v.battery < 25 ? "text-critical" : "text-warn"}
          />
        </div>

        <Panel title="Medical profile">
          {v.medical.length ? (
            <ul className="space-y-2">
              {v.medical.map((m) => (
                <li
                  key={m}
                  className="flex items-start gap-2 rounded-sm border border-critical/40 bg-critical/10 px-2.5 py-2"
                >
                  <Droplets className="mt-0.5 h-3.5 w-3.5 shrink-0 text-critical" />
                  <span className="text-xs font-semibold">{m}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-[11px] text-muted-foreground">
              No medical conditions reported over mesh.
            </p>
          )}
        </Panel>

        <Panel title="Contact & comms">
          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <Radio className="h-3.5 w-3.5 text-mesh" />
              <span className={cn("font-bold", commsTone(incident.comms))}>
                {incident.comms}
              </span>
              <span className="text-muted-foreground">
                · ROUTE {incident.route.join(" → ")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BatteryLow className="h-3.5 w-3.5 text-warn" />
              last contact {v.lastComms}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Languages className="h-3.5 w-3.5" />
              {v.languages.join(" · ")}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {v.people} person(s) at location · {incident.locationLabel}
            </div>
          </div>
          <Link
            to="/comms/$id"
            params={{ id: incident.id }}
            className="mt-3 flex items-center justify-center gap-1.5 rounded-sm border border-active-dim bg-active-dim/30 px-3 py-2 font-mono text-[10px] font-black tracking-[0.14em] text-active"
          >
            <MessageSquare className="h-3.5 w-3.5" /> OPEN MESH COMMS
          </Link>
        </Panel>

        <Panel title="Location history">
          <ol className="space-y-2">
            {v.locationHistory.map((l) => (
              <li key={l.time} className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mesh" />
                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold">{l.label}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    {l.time} · GPS ±{l.accuracy} m
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Prior incidents">
          {v.history.length ? (
            <ul className="divide-y divide-border">
              {v.history.map((h) => (
                <li key={h.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold">{h.type}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      #{h.id} · {h.date}
                    </div>
                  </div>
                  <span className="shrink-0 self-center font-mono text-[10px] font-bold text-safe">
                    {h.outcome}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <History className="h-3.5 w-3.5" /> First recorded contact with this unit.
            </p>
          )}
        </Panel>

        <p className={cn("px-1 font-mono text-[10px]", priorityText[incident.priority])}>
          {incident.priority} PRIORITY · DATA CACHED LOCALLY · SYNCS AT NEXT GATEWAY
        </p>
      </div>
    </AppShell>
  );
}
