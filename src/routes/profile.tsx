import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  BatteryMedium,
  Bell,
  Cpu,
  History,
  LogOut,
  Radio,
  Satellite,
  ShieldCheck,
  Signal,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import { AppShell, Panel, Stat } from "@/components/resq/AppShell";
import { NETWORK_STATE, OPERATOR } from "@/lib/resqnet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Rescuer Profile & Settings — ResQNet" },
      {
        name: "description",
        content:
          "Rescuer identity, certifications, mesh node radio settings and connectivity preferences for off-grid emergency response.",
      },
      { property: "og:title", content: "Rescuer Profile & Settings — ResQNet" },
      {
        property: "og:description",
        content: "Operator identity, device power state and off-grid radio configuration.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [duty, setDuty] = useState(true);
  const [toggles, setToggles] = useState({
    relay: true,
    lowPower: false,
    autoAck: true,
    sosAlerts: true,
  });

  const settings: { key: keyof typeof toggles; label: string; hint: string }[] = [
    { key: "relay", label: "ACT AS MESH RELAY", hint: "Forward peer traffic · higher battery use" },
    { key: "lowPower", label: "LOW POWER MODE", hint: "Longer beacon interval · slower comms" },
    { key: "autoAck", label: "AUTO-ACK NEW SOS", hint: "Confirm receipt to victim instantly" },
    { key: "sosAlerts", label: "CRITICAL SOS ALARM", hint: "Audible + haptic on critical alerts" },
  ];

  const links = [
    { icon: Wifi, label: "INTERNET", ok: NETWORK_STATE.internet, detail: NETWORK_STATE.internet ? "online" : "no uplink" },
    { icon: Signal, label: "CELLULAR", ok: NETWORK_STATE.cellular, detail: NETWORK_STATE.cellular ? "connected" : "no towers" },
    { icon: Satellite, label: "GPS", ok: NETWORK_STATE.gps, detail: OPERATOR.gps },
    {
      icon: Radio,
      label: "RESQNET MESH",
      ok: NETWORK_STATE.resqnet,
      detail: `${NETWORK_STATE.nodesOnline}/${NETWORK_STATE.nodesTotal} nodes · ${NETWORK_STATE.gatewayHops} hops`,
    },
  ];

  return (
    <AppShell title="Unit Profile" subtitle={`${OPERATOR.id} · ${OPERATOR.team}`} back="/dashboard">
      <div className="space-y-3">
        <Panel>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-sm border border-critical bg-critical/15 font-mono text-lg font-black text-critical">
              {OPERATOR.name.split(" ").slice(-1)[0]?.[0] ?? "R"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="truncate text-base font-bold">{OPERATOR.name}</h2>
                <BadgeCheck className="h-4 w-4 shrink-0 text-safe" />
              </div>
              <p className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {OPERATOR.role}
              </p>
              <p className="truncate font-mono text-[10px] text-muted-foreground">
                {OPERATOR.org} · shift {OPERATOR.shift}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDuty((d) => !d)}
            className={cn(
              "mt-3 w-full rounded-sm border px-3 py-2 font-mono text-[10px] font-black tracking-[0.14em]",
              duty
                ? "border-safe bg-safe/15 text-safe"
                : "border-border bg-panel-2 text-muted-foreground",
            )}
          >
            {duty ? "ON DUTY · AVAILABLE FOR DISPATCH" : "OFF DUTY · NOT DISPATCHABLE"}
          </button>
        </Panel>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Unit ID" value={OPERATOR.id} />
          <Stat label="Team" value={OPERATOR.team} tone="text-active" />
          <Stat label="Device batt" value={`${OPERATOR.battery}%`} tone="text-warn" />
          <Stat label="Mesh" value="ONLINE" tone="text-mesh" />
        </div>

        <Panel title="Connectivity">
          <ul className="space-y-2">
            {links.map((l) => (
              <li
                key={l.label}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-sm border border-border bg-panel-2/60 px-2.5 py-2"
              >
                <l.icon
                  className={cn("h-4 w-4 shrink-0", l.ok ? "text-safe" : "text-critical")}
                />
                <div className="min-w-0">
                  <div className="font-mono text-[10px] font-bold tracking-[0.12em]">
                    {l.label}
                  </div>
                  <div className="truncate font-mono text-[10px] text-muted-foreground">
                    {l.detail}
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 font-mono text-[9px] font-black tracking-[0.12em]",
                    l.ok ? "text-safe" : "text-critical",
                  )}
                >
                  {l.ok ? "UP" : "DOWN"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 font-mono text-[10px] text-muted-foreground">
            All rescue traffic is running over ResQNet mesh radio. Internet and cellular are not
            required for SOS receipt, comms or navigation.
          </p>
        </Panel>

        <Panel title="Device & radio">
          <div className="space-y-2 font-mono text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-mesh" /> {OPERATOR.device}
            </div>
            <div className="flex items-center gap-2">
              <BatteryMedium className="h-3.5 w-3.5 text-warn" /> {OPERATOR.battery}% · est. 7 h
              at current relay load
            </div>
            <div className="flex items-center gap-2">
              <Satellite className="h-3.5 w-3.5 text-safe" /> GPS {OPERATOR.gps}
            </div>
          </div>
        </Panel>

        <Panel title="Settings">
          <ul className="space-y-2">
            {settings.map((s) => (
              <li
                key={s.key}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-sm border border-border bg-panel-2/60 px-2.5 py-2"
              >
                <div className="min-w-0">
                  <div className="font-mono text-[10px] font-bold tracking-[0.12em]">
                    {s.label}
                  </div>
                  <div className="truncate font-mono text-[10px] text-muted-foreground">
                    {s.hint}
                  </div>
                </div>
                <button
                  onClick={() => setToggles((t) => ({ ...t, [s.key]: !t[s.key] }))}
                  aria-pressed={toggles[s.key]}
                  className={cn(
                    "h-6 w-11 shrink-0 rounded-full border p-0.5 transition-colors",
                    toggles[s.key] ? "border-active bg-active/30" : "border-border bg-background",
                  )}
                >
                  <span
                    className={cn(
                      "block h-4 w-4 rounded-full transition-transform",
                      toggles[s.key]
                        ? "translate-x-5 bg-active"
                        : "translate-x-0 bg-muted-foreground",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Certifications">
          <ul className="flex flex-wrap gap-1.5">
            {OPERATOR.cert.map((c) => (
              <li
                key={c}
                className="flex items-center gap-1 rounded-sm border border-safe/40 bg-safe/10 px-2 py-1 font-mono text-[10px] font-bold text-safe"
              >
                <ShieldCheck className="h-3 w-3" /> {c}
              </li>
            ))}
          </ul>
        </Panel>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/history"
            className="flex items-center justify-center gap-1.5 rounded-sm border border-border bg-panel-2 px-3 py-2.5 font-mono text-[10px] font-black tracking-[0.14em] text-foreground"
          >
            <History className="h-3.5 w-3.5" /> HISTORY
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-1.5 rounded-sm border border-critical bg-critical/15 px-3 py-2.5 font-mono text-[10px] font-black tracking-[0.14em] text-critical"
          >
            <LogOut className="h-3.5 w-3.5" /> SIGN OUT
          </Link>
        </div>

        <p className="flex items-center gap-1.5 px-1 font-mono text-[10px] text-muted-foreground">
          <Bell className="h-3 w-3" /> Settings stored on-device · applied to mesh radio instantly.
        </p>
      </div>
    </AppShell>
  );
}
