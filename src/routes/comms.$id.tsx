import { createFileRoute } from "@tanstack/react-router";
import { Radio, Send, ShieldAlert, Zap } from "lucide-react";
import { useState } from "react";
import { AppShell, Panel } from "@/components/resq/AppShell";
import { QUICK_REPLIES, getIncident, type Message } from "@/lib/resqnet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/comms/$id")({
  head: () => ({
    meta: [
      { title: "Mesh Comms — ResQNet Rescuer Console" },
      {
        name: "description",
        content:
          "Two-way off-grid messaging with victims over the ResQNet mesh, including hop tracing and store-and-forward delivery receipts.",
      },
      { property: "og:title", content: "Mesh Comms — ResQNet Rescuer Console" },
      {
        property: "og:description",
        content: "Text victims without internet or cellular using relayed mesh messaging.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommsScreen,
});

const deliveryTone: Record<Message["delivery"], string> = {
  SENT: "text-muted-foreground",
  RELAYED: "text-mesh",
  DELIVERED: "text-safe",
  PENDING: "text-warn",
  FAILED: "text-critical",
};

function CommsScreen() {
  const { id } = Route.useParams();
  const incident = getIncident(id);
  const [messages, setMessages] = useState<Message[]>(incident?.messages ?? []);
  const [draft, setDraft] = useState("");

  if (!incident) {
    return (
      <AppShell title="Channel unavailable" back="/emergencies">
        <Panel title="Not found">
          <p className="font-mono text-xs text-muted-foreground">No cached channel for #{id}.</p>
        </Panel>
      </AppShell>
    );
  }

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [
      ...m,
      {
        id: `m${m.length + 1}`,
        from: "rescuer",
        text: t,
        time: "NOW",
        delivery: incident.comms === "LOST" ? "PENDING" : "RELAYED",
        hops: incident.route.slice(1).reverse(),
      },
    ]);
    setDraft("");
  };

  return (
    <AppShell
      title={`Comms · #${incident.id}`}
      subtitle={`${incident.victim.name} · ${incident.comms} · batt ${incident.victim.battery}%`}
      back="/emergencies"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-lg border border-mesh-dim bg-mesh-dim/20 px-3 py-2">
          <Radio className="h-4 w-4 shrink-0 text-mesh" />
          <p className="font-mono text-[10px] leading-tight text-mesh">
            OFF-GRID CHANNEL · {incident.route.length - 1} HOPS · store-and-forward. Messages queue
            until a relay is in range.
          </p>
        </div>

        <Panel title="Transcript">
          <div className="space-y-2.5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex", m.from === "rescuer" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg border px-2.5 py-2",
                    m.from === "rescuer"
                      ? "border-mesh-dim bg-panel-2"
                      : "border-critical-dim bg-critical-dim/20",
                  )}
                >
                  <p className="text-[13px] leading-snug">{m.text}</p>
                  <div className="mt-1 flex items-center gap-2 font-mono text-[9px] tracking-[0.1em]">
                    <span className="text-muted-foreground">{m.time}</span>
                    <span className={deliveryTone[m.delivery]}>{m.delivery}</span>
                    {m.hops && m.hops.length > 0 && (
                      <span className="text-muted-foreground">via {m.hops.join(" › ")}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Quick replies — low bandwidth">
          <div className="flex flex-wrap gap-1.5">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="rounded-sm border border-border bg-panel-2 px-2.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.06em] hover:border-mesh hover:text-mesh"
              >
                {q}
              </button>
            ))}
          </div>
        </Panel>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="sticky bottom-20 grid grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-lg border border-border bg-panel p-2"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type message (max 160 chars over mesh)"
            maxLength={160}
            className="w-full rounded-sm border border-border bg-background px-2.5 py-2 font-mono text-[12px] outline-none placeholder:text-muted-foreground focus:border-mesh"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-sm border border-mesh bg-mesh-dim/40 px-3 py-2 font-mono text-[10px] font-black tracking-[0.12em] text-mesh"
          >
            <Send className="h-3.5 w-3.5" /> SEND
          </button>
        </form>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-lg border border-warn-dim bg-warn-dim/15 px-3 py-2">
            <Zap className="h-3.5 w-3.5 shrink-0 text-warn" />
            <p className="font-mono text-[10px] text-warn">
              Victim battery {incident.victim.battery}% — keep messages short.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-critical" />
            <p className="font-mono text-[10px] text-muted-foreground">
              Languages: {incident.victim.languages.join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
