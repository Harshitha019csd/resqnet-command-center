import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUp,
  Compass,
  CornerUpRight,
  Flag,
  MapPin,
  MessageSquare,
  Satellite,
} from "lucide-react";
import { AppShell, Panel, Stat } from "@/components/resq/AppShell";
import { TacticalMap } from "@/components/resq/TacticalMap";
import { getIncident } from "@/lib/resqnet";

export const Route = createFileRoute("/navigate/$id")({
  head: () => ({
    meta: [
      { title: "Rescuer Navigation — ResQNet Rescuer Console" },
      {
        name: "description",
        content:
          "Offline turn-by-turn navigation to an SOS location using cached tiles, GPS-only positioning and hazard warnings.",
      },
      { property: "og:title", content: "Rescuer Navigation — ResQNet Rescuer Console" },
      {
        property: "og:description",
        content: "GPS-only routing to the victim with cached offline maps and hazard alerts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NavigateScreen,
});

const steps = [
  { icon: ArrowUp, text: "Head north on Depot Road", dist: "600 m" },
  { icon: CornerUpRight, text: "Turn right at collapsed footbridge (detour marked)", dist: "1.1 km" },
  { icon: AlertTriangle, text: "Flooded underpass — use embankment track", dist: "400 m" },
  { icon: CornerUpRight, text: "Left into Riverbank Rd, Blk C service lane", dist: "300 m" },
  { icon: Flag, text: "Arrive at SOS origin — stairwell entrance", dist: "0 m" },
];

function NavigateScreen() {
  const { id } = Route.useParams();
  const incident = getIncident(id);

  if (!incident) {
    return (
      <AppShell title="No route" back="/emergencies">
        <Panel title="Not found">
          <p className="font-mono text-xs text-muted-foreground">Incident #{id} not cached.</p>
        </Panel>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={`Navigate · #${incident.id}`}
      subtitle={`${incident.locationLabel} · offline tiles`}
      back="/emergencies"
      actions={
        <Link
          to="/comms/$id"
          params={{ id: incident.id }}
          className="flex items-center gap-1.5 rounded-sm border border-border bg-panel-2 px-2 py-1 font-mono text-[10px] font-bold tracking-[0.1em] text-mesh"
        >
          <MessageSquare className="h-3 w-3" /> MSG
        </Link>
      }
    >
      <div className="space-y-3">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-lg border border-active bg-panel p-3">
          <div className="grid h-14 w-14 place-items-center rounded-full border border-active bg-panel-2">
            <ArrowUp className="h-7 w-7 text-active" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground">NEXT MANEUVER</p>
            <p className="truncate text-base font-bold">Head north on Depot Road</p>
            <p className="font-mono text-[11px] text-active">600 m · then right at footbridge</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Distance" value={`${incident.distanceKm} km`} />
          <Stat label="ETA" value={incident.etaMin ? `${incident.etaMin} min` : "ARRIVED"} tone="text-active" />
          <Stat label="GPS" value={`±${incident.gpsAccuracy} m`} tone="text-safe" />
          <Stat label="Mode" value="OFFLINE" tone="text-warn" />
        </div>

        <Panel title="Cached route">
          <TacticalMap
            selectedId={incident.id}
            height="h-[42vh]"
            highlightRoute={incident.route}
            filter={{ victims: true, rescuers: true, nodes: false, safe: true }}
          />
          <p className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <Satellite className="h-3 w-3 text-safe" /> GPS works without internet — tiles preloaded
            before deployment. No live traffic data.
          </p>
        </Panel>

        <Panel title="Turn-by-turn">
          <ol className="space-y-1.5">
            {steps.map((s, i) => (
              <li
                key={s.text}
                className="flex items-center gap-2 rounded-sm border border-border bg-panel-2/60 px-2.5 py-2"
              >
                <span className="font-mono text-[10px] text-muted-foreground">{i + 1}</span>
                <s.icon className="h-4 w-4 shrink-0 text-active" />
                <span className="min-w-0 flex-1 truncate text-[12px]">{s.text}</span>
                <span className="shrink-0 font-mono text-[10px] font-bold">{s.dist}</span>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="On-arrival checklist">
          <ul className="space-y-1.5 font-mono text-[11px] text-muted-foreground">
            <li>· Mark ON SCENE to stamp the incident timeline.</li>
            <li>· Confirm head-count: {incident.people} reported.</li>
            <li>· Relay victim status upstream via {incident.route[incident.route.length - 1]}.</li>
          </ul>
          <div className="mt-2 flex items-center gap-2 rounded-sm border border-border bg-panel-2/60 px-2.5 py-2">
            <MapPin className="h-3.5 w-3.5 text-critical" />
            <span className="font-mono text-[10px]">
              {incident.coords.lat.toFixed(4)}, {incident.coords.lon.toFixed(4)}
            </span>
            <Compass className="ml-auto h-3.5 w-3.5 text-mesh" />
            <span className="font-mono text-[10px] text-mesh">BEARING 018°</span>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
