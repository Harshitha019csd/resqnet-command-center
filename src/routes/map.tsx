import { createFileRoute, Link } from "@tanstack/react-router";
import { Layers, Navigation } from "lucide-react";
import { useState } from "react";
import { AppShell, Panel } from "@/components/resq/AppShell";
import { MapLegend, MapQuickLinks, TacticalMap, type MapFilter } from "@/components/resq/TacticalMap";
import { INCIDENTS, commsTone, priorityText, type Incident } from "@/lib/resqnet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Live Emergency Map — ResQNet Rescuer" },
      {
        name: "description",
        content:
          "Offline tactical map of victims, rescue teams, mesh relays and safe zones with cached vector tiles.",
      },
      { property: "og:title", content: "Live Emergency Map — ResQNet Rescuer" },
      {
        property: "og:description",
        content: "Cached offline situational map for search-and-rescue field operations.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [filter, setFilter] = useState<MapFilter>({
    victims: true,
    rescuers: true,
    nodes: true,
    safe: true,
  });
  const [selected, setSelected] = useState<Incident | null>(INCIDENTS[0] ?? null);

  const toggles: { key: keyof MapFilter; label: string; tone: string }[] = [
    { key: "victims", label: "VICTIMS", tone: "text-critical" },
    { key: "rescuers", label: "TEAMS", tone: "text-active" },
    { key: "nodes", label: "RELAYS", tone: "text-mesh" },
    { key: "safe", label: "SAFE ZONES", tone: "text-safe" },
  ];

  return (
    <AppShell title="Live Map" subtitle="Offline cached tiles · mesh overlay" back="/dashboard">
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Layers className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          {toggles.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter((f) => ({ ...f, [t.key]: !f[t.key] }))}
              className={cn(
                "shrink-0 rounded-sm border px-2.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.12em]",
                filter[t.key]
                  ? cn("border-border bg-panel-2", t.tone)
                  : "border-border bg-background text-muted-foreground opacity-60",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <TacticalMap
          selectedId={selected?.id ?? ""}
          onSelect={setSelected}
          filter={filter}
          highlightRoute={selected?.route ?? []}
        />

        {selected && (
          <div className="panel p-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("font-mono text-[10px] font-black tracking-[0.14em]", priorityText[selected.priority])}>
                    {selected.priority}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">#{selected.id}</span>
                </div>
                <h2 className="mt-1 truncate text-base font-bold">{selected.type}</h2>
                <p className="truncate font-mono text-[10px] text-muted-foreground">
                  {selected.locationLabel} · {selected.coords.lat.toFixed(4)},{" "}
                  {selected.coords.lon.toFixed(4)} · ±{selected.gpsAccuracy} m
                </p>
                <p className={cn("mt-1 font-mono text-[10px] font-bold", commsTone(selected.comms))}>
                  COMMS {selected.comms} · ROUTE {selected.route.join(" → ")}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-mono text-xl font-black leading-none">{selected.distanceKm}</div>
                <div className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground">KM</div>
              </div>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <Link
                to="/emergency/$id"
                params={{ id: selected.id }}
                className="rounded-sm border border-critical bg-critical px-3 py-2 text-center font-mono text-[10px] font-black tracking-[0.14em] text-critical-foreground"
              >
                OPEN INCIDENT
              </Link>
              <Link
                to="/navigate/$id"
                params={{ id: selected.id }}
                className="flex items-center justify-center gap-1.5 rounded-sm border border-active-dim bg-active-dim/30 px-3 py-2 font-mono text-[10px] font-black tracking-[0.14em] text-active"
              >
                <Navigation className="h-3.5 w-3.5" /> NAVIGATE
              </Link>
            </div>
          </div>
        )}

        <Panel title="Legend">
          <MapLegend />
          <div className="mt-3">
            <MapQuickLinks />
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
