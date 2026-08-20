import { Link } from "@tanstack/react-router";
import {
  Flame,
  Home,
  RadioTower,
  Radio,
  ShieldCheck,
  Siren,
  Truck,
  UserRound,
} from "lucide-react";
import { INCIDENTS, NODES, RESCUERS, type Incident } from "@/lib/resqnet";
import { cn } from "@/lib/utils";

export type MapFilter = {
  victims: boolean;
  rescuers: boolean;
  nodes: boolean;
  safe: boolean;
};

const linkPairs = NODES.flatMap((n) =>
  n.peers
    .map((p) => NODES.find((x) => x.id === p))
    .filter(Boolean)
    .map((peer) => ({ a: n, b: peer!, live: n.online && peer!.online })),
);

export function TacticalMap({
  selectedId,
  onSelect,
  filter = { victims: true, rescuers: true, nodes: true, safe: true },
  height = "h-[62vh]",
  highlightRoute,
}: {
  selectedId?: string;
  onSelect?: (incident: Incident) => void;
  filter?: MapFilter;
  height?: string;
  highlightRoute?: string[];
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg border border-border bg-background grid-bg",
        height,
      )}
    >
      {/* terrain: river + flood zone */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path
          d="M -5 72 C 20 62, 30 82, 55 74 C 78 67, 88 84, 105 78 L 105 105 L -5 105 Z"
          fill="var(--terrain)"
          opacity="0.9"
        />
        <path
          d="M -5 72 C 20 62, 30 82, 55 74 C 78 67, 88 84, 105 78"
          stroke="var(--mesh)"
          strokeWidth="0.4"
          fill="none"
          opacity="0.5"
        />
        <circle cx="34" cy="38" r="14" fill="var(--critical)" opacity="0.07" />
        <circle cx="16" cy="20" r="16" fill="var(--warn)" opacity="0.06" />
        {linkPairs.map((l, i) => {
          const hot =
            highlightRoute &&
            highlightRoute.includes(l.a.id) &&
            highlightRoute.includes(l.b.id);
          return (
            <line
              key={i}
              x1={l.a.map.x}
              y1={l.a.map.y}
              x2={l.b.map.x}
              y2={l.b.map.y}
              stroke={hot ? "var(--critical)" : l.live ? "var(--mesh)" : "var(--muted-foreground)"}
              strokeWidth={hot ? 0.7 : 0.3}
              strokeDasharray={l.live ? undefined : "1 1.5"}
              opacity={hot ? 1 : l.live ? 0.55 : 0.25}
              className={hot ? "mesh-flow" : undefined}
            />
          );
        })}
      </svg>

      {/* offline map notice */}
      <div className="absolute left-2 top-2 z-20 rounded-sm border border-warn-dim bg-warn-dim/30 px-2 py-1 font-mono text-[9px] font-bold tracking-[0.12em] text-warn">
        OFFLINE VECTOR TILES · CACHED 18:04
      </div>

      {filter.nodes &&
        NODES.filter((n) => n.kind === "RELAY" || n.kind === "GATEWAY").map((n) => (
          <Marker key={n.id} x={n.map.x} y={n.map.y} label={n.id}>
            <div
              className={cn(
                "grid h-6 w-6 place-items-center rounded-sm border",
                n.kind === "GATEWAY"
                  ? "border-mesh bg-mesh-dim text-mesh"
                  : n.online
                    ? "border-mesh-dim bg-panel text-mesh"
                    : "border-critical bg-critical-dim text-critical",
              )}
            >
              {n.kind === "GATEWAY" ? (
                <RadioTower className="h-3.5 w-3.5" />
              ) : (
                <Radio className="h-3 w-3" />
              )}
            </div>
          </Marker>
        ))}

      {filter.safe &&
        NODES.filter((n) => n.kind === "SAFE").map((n) => (
          <Marker key={n.id} x={n.map.x} y={n.map.y} label="SAFE">
            <div className="grid h-6 w-6 place-items-center rounded-sm border border-safe bg-safe-dim text-safe">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </Marker>
        ))}

      {filter.rescuers &&
        RESCUERS.filter((r) => r.status !== "OFF DUTY").map((r) => (
          <Marker key={r.id} x={r.map.x} y={r.map.y} label={r.id}>
            <div className="grid h-6 w-6 place-items-center rounded-full border border-active bg-active-dim text-active">
              <Truck className="h-3.5 w-3.5" />
            </div>
          </Marker>
        ))}

      {filter.victims &&
        INCIDENTS.map((i) => {
          const resolved = i.status === "RESOLVED";
          const critical = i.priority === "CRITICAL" && !resolved;
          const sel = selectedId === i.id;
          return (
            <Marker key={i.id} x={i.map.x} y={i.map.y} label={`#${i.id}`}>
              <button
                onClick={() => onSelect?.(i)}
                aria-label={`Emergency ${i.id}`}
                className="relative grid place-items-center"
              >
                {critical && (
                  <span className="pulse-ring absolute h-8 w-8 rounded-full border-2 border-critical" />
                )}
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full border-2",
                    resolved
                      ? "border-safe bg-safe-dim text-safe"
                      : critical
                        ? "border-critical bg-critical text-critical-foreground"
                        : i.priority === "HIGH"
                          ? "border-active bg-active-dim text-active"
                          : "border-warn bg-warn-dim text-warn",
                    sel && "ring-2 ring-offset-2 ring-offset-background ring-foreground",
                  )}
                >
                  {resolved ? (
                    <Home className="h-4 w-4" />
                  ) : i.type.startsWith("Fire") ? (
                    <Flame className="h-4 w-4" />
                  ) : critical ? (
                    <Siren className="h-4 w-4" />
                  ) : (
                    <UserRound className="h-4 w-4" />
                  )}
                </span>
              </button>
            </Marker>
          );
        })}
    </div>
  );
}

function Marker({
  x,
  y,
  label,
  children,
}: {
  x: number;
  y: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="flex flex-col items-center gap-0.5">
        {children}
        <span className="rounded-[2px] bg-background/80 px-1 font-mono text-[8px] font-bold tracking-wide text-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}

export function MapLegend() {
  const items = [
    { c: "bg-critical", t: "Person in danger" },
    { c: "bg-active", t: "Rescuer / team" },
    { c: "bg-mesh", t: "Relay node" },
    { c: "bg-mesh-dim", t: "Gateway" },
    { c: "bg-safe", t: "Safe location" },
    { c: "bg-safe-dim", t: "Completed rescue" },
  ];
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 sm:grid-cols-3">
      {items.map((i) => (
        <div key={i.t} className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", i.c)} />
          <span className="truncate font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            {i.t}
          </span>
        </div>
      ))}
    </div>
  );
}

export function MapQuickLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        to="/network"
        className="rounded-sm border border-mesh-dim bg-mesh-dim/25 px-2.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.12em] text-mesh"
      >
        MESH MONITOR
      </Link>
      <Link
        to="/assignments"
        className="rounded-sm border border-active-dim bg-active-dim/25 px-2.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.12em] text-active"
      >
        ASSIGNMENTS
      </Link>
    </div>
  );
}
