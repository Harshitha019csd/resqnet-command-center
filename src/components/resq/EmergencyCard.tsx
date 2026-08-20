import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Navigation, Radio, Users } from "lucide-react";
import {
  commsTone,
  priorityClasses,
  statusTone,
  type Incident,
} from "@/lib/resqnet";
import { cn } from "@/lib/utils";

export function EmergencyCard({ incident }: { incident: Incident }) {
  const critical = incident.priority === "CRITICAL" && incident.status !== "RESOLVED";
  return (
    <Link
      to="/emergency/$id"
      params={{ id: incident.id }}
      className={cn(
        "block rounded-lg border bg-panel p-3 transition-colors hover:bg-panel-2",
        critical ? "border-critical shadow-critical" : "border-border",
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-[3px] border px-1.5 py-0.5 font-mono text-[9px] font-black tracking-[0.14em]",
                priorityClasses[incident.priority],
                critical && "blink",
              )}
            >
              {incident.priority}
            </span>
            <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
              #{incident.id}
            </span>
          </div>
          <h3 className="mt-1.5 truncate text-base font-bold leading-tight">{incident.type}</h3>
          <p className="mt-0.5 flex items-center gap-1 truncate font-mono text-[10px] text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            {incident.locationLabel}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-lg font-black leading-none">{incident.distanceKm}</div>
          <div className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground">KM AWAY</div>
        </div>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        <Meta icon={Users} label="PEOPLE" value={String(incident.people)} />
        <Meta icon={Clock} label="RECEIVED" value={`${incident.receivedAt} · ${incident.minutesAgo}m`} />
        <Meta
          icon={Radio}
          label="COMMS"
          value={incident.comms}
          tone={commsTone(incident.comms)}
        />
        <Meta icon={Navigation} label="ETA" value={incident.etaMin ? `${incident.etaMin} min` : "ON SCENE"} />
      </div>

      <div className="mt-2.5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-border pt-2">
        <p className="truncate font-mono text-[10px] text-muted-foreground">
          LAST: “{incident.lastMessage}” · {incident.lastUpdate}
        </p>
        <span
          className={cn(
            "shrink-0 font-mono text-[10px] font-bold tracking-[0.1em]",
            statusTone(incident.status),
          )}
        >
          {incident.status}
        </span>
      </div>
    </Link>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-sm border border-border bg-panel-2/50 px-2 py-1.5">
      <div className="flex items-center gap-1 font-mono text-[9px] tracking-[0.12em] text-muted-foreground">
        <Icon className="h-2.5 w-2.5" /> {label}
      </div>
      <div className={cn("mt-0.5 truncate font-mono text-[11px] font-bold", tone)}>{value}</div>
    </div>
  );
}
