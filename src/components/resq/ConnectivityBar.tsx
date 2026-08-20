import { Globe, RadioTower, Satellite, SignalHigh, Wifi } from "lucide-react";
import { NETWORK_STATE } from "@/lib/resqnet";
import { cn } from "@/lib/utils";

type Chip = {
  label: string;
  state: string;
  ok: boolean;
  warn?: boolean;
  icon: typeof Globe;
};

const chips: Chip[] = [
  { label: "INTERNET", state: NETWORK_STATE.internet ? "UP" : "DOWN", ok: NETWORK_STATE.internet, icon: Globe },
  { label: "CELLULAR", state: NETWORK_STATE.cellular ? "UP" : "NO SIGNAL", ok: NETWORK_STATE.cellular, icon: SignalHigh },
  { label: "GPS", state: NETWORK_STATE.gps ? "LOCKED ±4m" : "NO FIX", ok: NETWORK_STATE.gps, icon: Satellite },
  {
    label: "RESQNET MESH",
    state: `${NETWORK_STATE.nodesOnline}/${NETWORK_STATE.nodesTotal} NODES`,
    ok: NETWORK_STATE.resqnet,
    icon: RadioTower,
  },
];

export function ConnectivityBar({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-stretch gap-1 overflow-x-auto">
      {chips.map((c) => (
        <div
          key={c.label}
          className={cn(
            "flex min-w-0 flex-1 shrink-0 items-center gap-1.5 rounded-sm border px-2 py-1",
            c.ok
              ? "border-safe-dim bg-safe-dim/25 text-safe"
              : "border-critical-dim bg-critical-dim/25 text-critical",
          )}
        >
          <c.icon className="h-3 w-3 shrink-0" strokeWidth={2.5} />
          <div className="min-w-0 leading-none">
            <div className="font-mono text-[9px] tracking-[0.14em] opacity-80">{c.label}</div>
            {!compact && <div className="truncate font-mono text-[10px] font-bold">{c.state}</div>}
          </div>
        </div>
      ))}
      <div className="flex shrink-0 items-center gap-1 rounded-sm border border-mesh-dim bg-mesh-dim/20 px-2 text-mesh">
        <Wifi className="h-3 w-3 blink" strokeWidth={2.5} />
        <span className="font-mono text-[10px] font-bold">{NETWORK_STATE.meshLatencyMs} ms</span>
      </div>
    </div>
  );
}
