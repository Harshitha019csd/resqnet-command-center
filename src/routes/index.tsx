import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound, Radio, ShieldAlert, Siren } from "lucide-react";
import { useState } from "react";
import { ConnectivityBar } from "@/components/resq/ConnectivityBar";
import { OPERATOR, TEAMS } from "@/lib/resqnet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rescuer Sign-In — ResQNet Console" },
      {
        name: "description",
        content:
          "Authenticate as a disaster-response rescuer and go on-duty on the ResQNet off-grid mesh.",
      },
      { property: "og:title", content: "Rescuer Sign-In — ResQNet Console" },
      {
        property: "og:description",
        content: "Verified responder access to the ResQNet off-grid rescue coordination mesh.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [team, setTeam] = useState(OPERATOR.team);
  const [availability, setAvailability] = useState<"AVAILABLE" | "STANDBY">("AVAILABLE");
  const [id, setId] = useState(OPERATOR.id);
  const [pin, setPin] = useState("");

  return (
    <div className="min-h-screen bg-background grid-bg">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-3 pb-8 pt-2">
        <ConnectivityBar compact />

        <div className="mt-8 flex items-center gap-3">
          <div className="relative grid h-12 w-12 place-items-center rounded-lg border border-critical bg-critical-dim/40 text-critical">
            <span className="pulse-ring absolute h-12 w-12 rounded-lg border border-critical" />
            <Siren className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold uppercase leading-none tracking-wide">
              ResQNet
            </h1>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-mesh">
              Rescuer Operations Console
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-sm border border-warn-dim bg-warn-dim/25 px-2.5 py-2 text-warn">
          <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
          <p className="font-mono text-[10px] leading-tight tracking-wide">
            NO INTERNET · OPERATING ON LOCAL MESH · CREDENTIALS VERIFIED OFFLINE
          </p>
        </div>

        <form
          className="panel mt-4 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/dashboard" });
          }}
        >
          <Field label="RESPONDER ID">
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full rounded-sm border border-input bg-background px-3 py-2.5 font-mono text-sm font-bold tracking-wider outline-none focus:border-ring"
              placeholder="RSQ-0000"
            />
          </Field>

          <Field label="ACCESS PIN">
            <div className="flex items-center gap-2 rounded-sm border border-input bg-background px-3 focus-within:border-ring">
              <KeyRound className="h-4 w-4 text-muted-foreground" />
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                type="password"
                inputMode="numeric"
                placeholder="••••••"
                className="w-full bg-transparent py-2.5 font-mono text-sm tracking-[0.4em] outline-none"
              />
            </div>
          </Field>

          <Field label="TEAM / UNIT">
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full rounded-sm border border-input bg-background px-3 py-2.5 font-mono text-xs font-bold uppercase tracking-wider outline-none focus:border-ring"
            >
              {TEAMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="SHIFT AVAILABILITY">
            <div className="grid grid-cols-2 gap-2">
              {(["AVAILABLE", "STANDBY"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvailability(a)}
                  className={cn(
                    "rounded-sm border px-3 py-2.5 font-mono text-[11px] font-bold tracking-[0.14em]",
                    availability === a
                      ? a === "AVAILABLE"
                        ? "border-safe bg-safe-dim/40 text-safe"
                        : "border-warn bg-warn-dim/40 text-warn"
                      : "border-border bg-panel-2 text-muted-foreground",
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </Field>

          <button
            type="submit"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm border border-critical bg-critical px-4 py-3 font-mono text-xs font-black tracking-[0.2em] text-critical-foreground shadow-critical"
          >
            <Radio className="h-4 w-4" /> GO ON DUTY
          </button>

          <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            Device {OPERATOR.device} · Mesh key pinned · Shift {OPERATOR.shift}
          </p>
        </form>

        <div className="mt-auto grid grid-cols-3 gap-2 pt-6">
          {[
            { k: "MESH NODES", v: "14/16" },
            { k: "OPEN SOS", v: "5" },
            { k: "UPLINK", v: "GW-01" },
          ].map((s) => (
            <div key={s.k} className="rounded-sm border border-border bg-panel px-2 py-2 text-center">
              <div className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground">
                {s.k}
              </div>
              <div className="mt-1 font-mono text-sm font-black">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-3 block first:mt-0">
      <span className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
