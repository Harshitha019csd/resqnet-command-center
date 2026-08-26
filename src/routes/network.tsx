import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, BatteryLow, Radio, RadioTower, RefreshCw, Wifi } from "lucide-react";
import { useState } from "react";
import { AppShell, Panel, Stat } from "@/components/resq/AppShell";
import { TacticalMap } from "@/components/resq/TacticalMap";
import { COVERAGE_GAPS, NETWORK_STATE, NODES, priorityText, type MeshNode } from "@/lib/resqnet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: "Mesh Monitor — ResQNet Rescuer Console" },
      {
        name: "description",
        content:
          "Monitor ResQNet mesh topology: relay health, link quality, node batteries, gateway hops and coverage blind spots while internet and cellular are down.",
      },
      { property: "og:title", content: "Mesh Monitor — ResQNet Rescuer Console" },
      {
        property: "og:description",
        content: "Relay health, link quality and coverage gaps across the off-grid mesh.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NetworkScreen,
});

const kindTone: Record<MeshNode["kind"], string> = {
  GATEWAY: "text-safe",
  RELAY: "text-mesh",
  USER: "text-critical",
  RESCUER: "text-active",
  SAFE: "text-safe",
};

function NetworkScreen() {
  const [kind, setKind] = useState<"ALL" | MeshNode["kind"]>("ALL");
  const nodes = NODES.filter((n) => kind === "ALL" || n.kind === kind);
  const offline = NODES.filter((n) => !n.online);
  const avgLink = Math.round(
    NODES.filter((n) => n.online).reduce((a, n) => a + n.linkQuality, 0) /
      NODES.filter((n) => n.online).length,
  );

  return (
    <AppShell
      title="Mesh monitor"
      subtitle={`${NETWORK_STATE.nodesOnline}/${NETWORK_STATE.nodesTotal} nodes online · ${NETWORK_STATE.gatewayHops} hops to gateway`}
      actions={
        <button className="flex items-center gap-1.5 rounded-sm border border-border bg-panel-2 px-2 py-1 font-mono text-[10px] font-bold tracking-[0.1em] text-mesh">
          <RefreshCw className="h-3 w-3" /> RESCAN
        </button>
      }
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Nodes online" value={`${NETWORK_STATE.nodesOnline}/${NETWORK_STATE.nodesTotal}`} tone="text-safe" />
          <Stat label="Avg link" value={`${avgLink}%`} tone="text-mesh" />
          <Stat label="Mesh latency" value={`${(NETWORK_STATE.meshLatencyMs / 1000).toFixed(1)} s`} tone="text-warn" />
          <Stat label="Offline nodes" value={offline.length} tone="text-critical" />
        </div>

        <Panel title="Transport status">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            <Transport label="Internet" ok={NETWORK_STATE.internet} note="no uplink" />
            <Transport label="Cellular" ok={NETWORK_STATE.cellular} note="towers down" />
            <Transport label="GPS" ok={NETWORK_STATE.gps} note="locked ±4 m" />
            <Transport label="ResQNet" ok={NETWORK_STATE.resqnet} note="mesh active" />
          </div>
          <p className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <Radio className="h-3 w-3 text-mesh" /> All traffic is routed peer-to-peer over LoRa /
            Wi-Fi Direct until a gateway uplink returns.
          </p>
        </Panel>

        <Panel title="Topology — live links">
          <TacticalMap height="h-[40vh]" filter={{ victims: true, rescuers: false, nodes: true, safe: true }} />
        </Panel>

        <Panel
          title="Nodes"
          right={
            <div className="flex gap-1">
              {(["ALL", "GATEWAY", "RELAY", "USER", "SAFE"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={cn(
                    "rounded-sm border px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.1em]",
                    kind === k
                      ? "border-mesh bg-mesh-dim/40 text-mesh"
                      : "border-border bg-panel-2 text-muted-foreground",
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
          }
        >
          <ul className="space-y-1.5">
            {nodes.map((n) => (
              <li
                key={n.id}
                className={cn(
                  "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-sm border px-2.5 py-2",
                  n.online ? "border-border bg-panel-2/60" : "border-critical-dim bg-critical-dim/15",
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <RadioTower className={cn("h-3.5 w-3.5", kindTone[n.kind])} />
                    <span className="font-mono text-[11px] font-bold">{n.id}</span>
                    <span className={cn("font-mono text-[9px] tracking-[0.12em]", kindTone[n.kind])}>
                      {n.kind}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                    {n.label} · peers {n.peers.length || "—"} · seen {n.lastSeen}
                  </p>
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className={cn("h-full", n.linkQuality > 55 ? "bg-mesh" : n.linkQuality > 0 ? "bg-warn" : "bg-critical")}
                      style={{ width: `${Math.max(n.linkQuality, 2)}%` }}
                    />
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div
                    className={cn(
                      "font-mono text-sm font-black leading-none",
                      n.online ? "text-foreground" : "text-critical",
                    )}
                  >
                    {n.online ? `${n.linkQuality}%` : "DOWN"}
                  </div>
                  <div
                    className={cn(
                      "mt-1 flex items-center justify-end gap-1 font-mono text-[9px]",
                      n.battery < 20 ? "text-critical" : "text-muted-foreground",
                    )}
                  >
                    <BatteryLow className="h-3 w-3" /> {n.battery}%
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Coverage blind spots">
          <ul className="space-y-1.5">
            {COVERAGE_GAPS.map((g) => (
              <li
                key={g.id}
                className="flex items-start gap-2 rounded-sm border border-border bg-panel-2/60 px-2.5 py-2"
              >
                <AlertTriangle className={cn("mt-0.5 h-4 w-4 shrink-0", priorityText[g.severity])} />
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-bold">{g.area}</p>
                  <p className="truncate font-mono text-[10px] text-muted-foreground">
                    {g.reason} · last contact {g.lastContact}
                  </p>
                </div>
                <span
                  className={cn(
                    "ml-auto shrink-0 font-mono text-[10px] font-bold",
                    priorityText[g.severity],
                  )}
                >
                  {g.severity}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}

function Transport({ label, ok, note }: { label: string; ok: boolean; note: string }) {
  return (
    <div
      className={cn(
        "rounded-sm border px-2.5 py-2",
        ok ? "border-safe-dim bg-safe-dim/20" : "border-critical-dim bg-critical-dim/20",
      )}
    >
      <div className="flex items-center gap-1.5">
        <Wifi className={cn("h-3.5 w-3.5", ok ? "text-safe" : "text-critical")} />
        <span className="font-mono text-[10px] font-bold tracking-[0.1em]">{label}</span>
      </div>
      <p className={cn("mt-1 font-mono text-[10px]", ok ? "text-safe" : "text-critical")}>
        {ok ? "ONLINE" : "OFFLINE"} · {note}
      </p>
    </div>
  );
}
