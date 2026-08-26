import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Droplets,
  HeartPulse,
  MapPin,
  MessageSquare,
  Navigation,
  Radio,
  Route as RouteIcon,
  Satellite,
  Users,
} from "lucide-react";
import { useState } from "react";
import { AppShell, Panel, Stat } from "@/components/resq/AppShell";
import { TacticalMap } from "@/components/resq/TacticalMap";
import {
  STATUS_FLOW,
  commsTone,
  getIncident,
  priorityClasses,
  statusTone,
  type IncidentStatus,
} from "@/lib/resqnet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/emergency/$id")({
  head: () => ({
    meta: [
      { title: "SOS Detail — ResQNet Rescuer Console" },
      {
        name: "description",
        content:
          "Full off-grid SOS dossier: victim medical data, mesh route, GPS accuracy and response actions for field rescue teams.",
      },
      { property: "og:title", content: "SOS Detail — ResQNet Rescuer Console" },
      {
        property: "og:description",
        content: "Victim medical data, mesh relay path and rescue actions for a single emergency.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmergencyDetail,
});

function EmergencyDetail() {
  const { id } = Route.useParams();
  const incident = getIncident(id);
  const [status, setStatus] = useState<IncidentStatus | null>(null);

  if (!incident) {
    return (
      <AppShell title="Unknown SOS" subtitle="record not on this node" back="/emergencies">
        <Panel title="Not found">
          <p className="font-mono text-xs text-muted-foreground">
            Incident #{id} is not cached on this device. Sync when a gateway is in range.
          </p>
        </Panel>
      </AppShell>
    );
  }

  const current = status ?? incident.status;
  const idx = STATUS_FLOW.indexOf(current);
  const next = STATUS_FLOW[idx + 1];

  return (
    <AppShell
      title={incident.code}
      subtitle={`${incident.type} · ${current}`}
      back="/emergencies"
      actions={
        <span
          className={cn(
            "rounded-[3px] border px-1.5 py-0.5 font-mono text-[9px] font-black tracking-[0.14em]",
            priorityClasses[incident.priority],
          )}
        >
          {incident.priority}
        </span>
      }
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="People" value={incident.people} tone="text-warn" />
          <Stat label="Distance" value={`${incident.distanceKm} km`} />
          <Stat
            label="ETA"
            value={incident.etaMin ? `${incident.etaMin} min` : "ON SCENE"}
            tone="text-active"
          />
          <Stat label="Comms" value={incident.comms} tone={commsTone(incident.comms)} />
        </div>

        <Panel title="Primary actions">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {next && (
              <button
                onClick={() => setStatus(next)}
                className="col-span-2 flex items-center justify-center gap-2 rounded-sm border border-critical bg-critical px-3 py-2.5 text-xs font-black uppercase tracking-[0.1em] text-critical-foreground sm:col-span-1"
              >
                <CheckCircle2 className="h-4 w-4" /> {next}
              </button>
            )}
            <Action to="/comms/$id" id={incident.id} icon={MessageSquare} label="Message" />
            <Action to="/navigate/$id" id={incident.id} icon={Navigation} label="Navigate" />
            <Action to="/assignments" icon={Users} label="Assign team" />
          </div>
          {status && (
            <p className="mt-2 font-mono text-[10px] text-safe">
              STATUS QUEUED LOCALLY · will sync via mesh gateway
            </p>
          )}
        </Panel>

        <Panel
          title="Location — offline cached tiles"
          right={
            <span className="font-mono text-[10px] text-muted-foreground">
              ±{incident.gpsAccuracy} m
            </span>
          }
        >
          <TacticalMap
            selectedId={incident.id}
            height="h-[38vh]"
            highlightRoute={incident.route}
            filter={{ victims: true, rescuers: true, nodes: true, safe: false }}
          />
          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            <Row icon={MapPin} label="Address" value={incident.locationLabel} />
            <Row
              icon={Satellite}
              label="Coords"
              value={`${incident.coords.lat.toFixed(4)}, ${incident.coords.lon.toFixed(4)}`}
            />
          </div>
        </Panel>

        <Panel
          title="Victim snapshot"
          right={
            <Link
              to="/victim/$id"
              params={{ id: incident.id }}
              className="font-mono text-[10px] font-bold tracking-[0.12em] text-mesh"
            >
              FULL PROFILE →
            </Link>
          }
        >
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              <Stat label="Name" value={incident.victim.name} />
              <Stat label="Age" value={incident.victim.age} />
              <Stat label="Blood" value={incident.victim.bloodType} tone="text-critical" />
              <Stat
                label="Device batt"
                value={`${incident.victim.battery}%`}
                tone={incident.victim.battery < 25 ? "text-critical" : "text-warn"}
              />
            </div>
            <ul className="space-y-1">
              {incident.victim.medical.length === 0 && (
                <li className="font-mono text-[11px] text-muted-foreground">
                  No medical flags reported.
                </li>
              )}
              {incident.victim.medical.map((m) => (
                <li
                  key={m}
                  className="flex items-center gap-2 rounded-sm border border-critical-dim bg-critical-dim/20 px-2 py-1.5"
                >
                  <HeartPulse className="h-3.5 w-3.5 shrink-0 text-critical" />
                  <span className="font-mono text-[11px]">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel title="Mesh delivery path">
          <div className="flex flex-wrap items-center gap-1.5">
            {incident.route.map((hop, i) => (
              <span key={hop} className="flex items-center gap-1.5">
                <span className="rounded-sm border border-mesh-dim bg-panel-2 px-2 py-1 font-mono text-[10px] font-bold text-mesh">
                  {hop}
                </span>
                {i < incident.route.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                )}
              </span>
            ))}
          </div>
          <p className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <Radio className="h-3 w-3" /> NO INTERNET · NO CELLULAR · delivered over ResQNet mesh
          </p>
        </Panel>

        <Panel
          title="Status timeline"
          right={
            <Link
              to="/timeline/$id"
              params={{ id: incident.id }}
              className="font-mono text-[10px] font-bold tracking-[0.12em] text-mesh"
            >
              AUDIT TRAIL →
            </Link>
          }
        >
          <ol className="space-y-1.5">
            {incident.timeline.map((t) => (
              <li key={t.status} className="flex items-center gap-2">
                <Activity className={cn("h-3.5 w-3.5", statusTone(t.status))} />
                <span className="font-mono text-[11px] font-bold">{t.status}</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                  {t.time} · {t.by}
                </span>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Situation notes">
          <p className="flex items-start gap-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
            <Droplets className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mesh" />
            “{incident.lastMessage}” — received {incident.lastUpdate} via{" "}
            {incident.route[incident.route.length - 1]}
          </p>
        </Panel>

        <Link
          to="/comms/$id"
          params={{ id: incident.id }}
          className="flex items-center justify-center gap-2 rounded-lg border border-mesh bg-mesh-dim/30 px-3 py-3 text-xs font-black uppercase tracking-[0.12em] text-mesh"
        >
          <RouteIcon className="h-4 w-4" /> Open two-way mesh channel
        </Link>
      </div>
    </AppShell>
  );
}

function Action({
  to,
  id,
  icon: Icon,
  label,
}: {
  to: "/comms/$id" | "/navigate/$id" | "/assignments";
  id?: string;
  icon: typeof Users;
  label: string;
}) {
  const cls =
    "flex items-center justify-center gap-1.5 rounded-sm border border-border bg-panel-2 px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-foreground";
  if (to === "/assignments") {
    return (
      <Link to={to} className={cls}>
        <Icon className="h-3.5 w-3.5" /> {label}
      </Link>
    );
  }
  return (
    <Link to={to} params={{ id: id! }} className={cls}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </Link>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-sm border border-border bg-panel-2/60 px-2.5 py-2">
      <Icon className="h-3.5 w-3.5 shrink-0 text-mesh" />
      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="ml-auto truncate font-mono text-[11px] font-bold">{value}</span>
    </div>
  );
}
