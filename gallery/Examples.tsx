import { useEffect, useState, type ReactNode } from "react";
import {
  Btn,
  Card,
  Stat,
  Led,
  Empty,
  Modal,
  Select,
  Badge,
  Banner,
  Progress,
  KV,
  Avatar,
  Skeleton,
  Field,
  Input,
  Tabs,
  RadioCard,
  Table,
  Stepper,
} from "../ui/src/index";
import type { Theme } from "./App";
import { Fly } from "./Fly";

// Clickable example screens: one per surface, built ONLY from ui/src
// primitives plus a little layout glue (ex-* classes in index.html). Domain
// composites (rail, slot grid) are sketched here as plain markup on tokens,
// exactly as a consuming app would build them.

export function Examples({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  return (
    <main className="ex-page">
      <div className="ex-intro">
        <Tabs
          tabs={[
            { id: "dark-industrial", label: "HMI · Panel an der Anlage" },
            { id: "light-cloud", label: "Cloud · Kundenportal" },
          ]}
          active={theme}
          onSelect={(id) => setTheme(id as Theme)}
        />
        <p className="ex-hint">
          Alles klickbar, nichts ist echt verbunden. Das Grün oben umschalten und dieselben Bildschirme
          vergleichen.
        </p>
      </div>
      {theme === "dark-industrial" ? <HmiExample /> : <CloudExample />}
    </main>
  );
}

/* ======================================================================
   HMI — dark-industrial, touch, calm
   ====================================================================== */

type HmiPage = "cockpit" | "regal" | "klima" | "wartung";
const RAIL: { id: HmiPage; label: string }[] = [
  { id: "cockpit", label: "Cockpit" },
  { id: "regal", label: "Regal" },
  { id: "klima", label: "Klima" },
  { id: "wartung", label: "Wartung" },
];

type Alarm = { id: number; tone: "warn" | "danger"; text: string; time: string };
const ALARMS: Alarm[] = [
  { id: 1, tone: "warn", text: "CO₂ über Grenzwert (1450 ppm)", time: "14:02" },
  { id: 2, tone: "danger", text: "Encoder Y1 meldet 0", time: "13:47" },
];

function HmiExample() {
  const [page, setPage] = useState<HmiPage>("cockpit");
  const [mode, setMode] = useState<"AUTO" | "HAND">("AUTO");
  return (
    <div className="ex-frame ex-hmi">
      <aside className="ex-rail">
        <span className="ex-rail-logo"><Fly height={76} dark /></span>
        {RAIL.map((r) => (
          <button
            key={r.id}
            className={"ex-rail-item" + (page === r.id ? " is-active" : "")}
            onClick={() => setPage(r.id)}
          >
            {r.label}
          </button>
        ))}
      </aside>
      <div className="ex-body">
        <header className="ex-hmi-top">
          <span className="ex-hmi-title">Mastanlage · Linie 1</span>
          <Led on label="OPC UA" />
          <Led on={mode === "AUTO"} label="Freigabe" />
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <Btn size="sm" variant={mode === "AUTO" ? "primary" : "default"} onClick={() => setMode("AUTO")}>
              Auto
            </Btn>
            <Btn size="sm" variant={mode === "HAND" ? "primary" : "default"} onClick={() => setMode("HAND")}>
              Hand
            </Btn>
          </div>
        </header>
        <div className="ex-content">
          {page === "cockpit" && <HmiCockpit />}
          {page === "regal" && <HmiRegal />}
          {page === "klima" && <HmiKlima />}
          {page === "wartung" && <HmiWartung />}
        </div>
      </div>
    </div>
  );
}

function HmiCockpit() {
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [pct, setPct] = useState(0);
  const [confirmStop, setConfirmStop] = useState(false);
  const [alarms, setAlarms] = useState(ALARMS);

  useEffect(() => {
    if (!running || paused) return;
    const t = setInterval(() => setPct((p) => (p >= 100 ? 100 : p + 2)), 120);
    return () => clearInterval(t);
  }, [running, paused]);
  useEffect(() => {
    if (pct >= 100) setRunning(false);
  }, [pct]);

  const state = pct >= 100 ? "fertig" : running ? (paused ? "pausiert" : "läuft") : "bereit";

  return (
    <>
      <div className="ex-grid4">
        <Stat label="Temperatur" value="27,4" unit="°C" hint="Soll 28,0" tone="ok" />
        <Stat label="Luftfeuchte" value="62" unit="% rF" hint="Soll 60" />
        <Stat label="CO₂" value="1450" unit="ppm" hint="Grenze 1200" tone="warn" />
        <Stat label="Waage" value="12,3" unit="kg" hint="Slot 4" />
      </div>
      <div className="ex-grid2">
        <Card
          title="Aktive Aktion"
          right={<Badge tone={state === "läuft" ? "primary" : state === "fertig" ? "ok" : "neutral"} dot>{state}</Badge>}
        >
          <KV label="Aktion" mono>MOVE Slot 4 → Waage</KV>
          <KV label="Wanne" mono>W-0172 · Charge 31</KV>
          <div style={{ margin: "14px 0" }}>
            <Progress value={pct} />
          </div>
          <div className="ex-actions">
            <Btn
              variant="primary"
              size="lg"
              disabled={running && !paused}
              onClick={() => {
                if (pct >= 100) setPct(0);
                setRunning(true);
                setPaused(false);
              }}
            >
              {paused ? "Fortsetzen" : "Start"}
            </Btn>
            <Btn size="lg" disabled={!running || paused} onClick={() => setPaused(true)}>
              Pause
            </Btn>
            <Btn variant="danger" size="lg" disabled={!running} onClick={() => setConfirmStop(true)}>
              Stopp
            </Btn>
          </div>
        </Card>
        <Card title="Alarme" right={<Badge tone={alarms.length ? "warn" : "ok"}>{alarms.length} offen</Badge>}>
          {alarms.length === 0 ? (
            <Empty message="Keine offenen Alarme" />
          ) : (
            <div className="ex-list">
              {alarms.map((a) => (
                <div key={a.id} className="ex-list-row">
                  <Badge tone={a.tone} dot>{a.time}</Badge>
                  <span style={{ flex: 1 }}>{a.text}</span>
                  <Btn size="sm" onClick={() => setAlarms((xs) => xs.filter((x) => x.id !== a.id))}>
                    Quittieren
                  </Btn>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      <Modal
        open={confirmStop}
        onClose={() => setConfirmStop(false)}
        title="Aktion stoppen?"
        footer={
          <>
            <Btn onClick={() => setConfirmStop(false)}>Abbrechen</Btn>
            <Btn
              variant="danger"
              onClick={() => {
                setRunning(false);
                setPaused(false);
                setPct(0);
                setConfirmStop(false);
              }}
            >
              Stoppen
            </Btn>
          </>
        }
      >
        Der Greifer hält an der aktuellen Position. Die Wanne bleibt im Greifer.
      </Modal>
    </>
  );
}

const SLOTS = Array.from({ length: 12 }, (_, i) => ({
  n: i + 1,
  tray: i === 3 ? null : `W-0${160 + i}`,
  day: (i * 3) % 14 + 1,
  state: i === 7 ? "warn" : i === 3 ? "empty" : "ok",
}));

function HmiRegal() {
  const [sel, setSel] = useState(1);
  const s = SLOTS[sel - 1];
  return (
    <div className="ex-grid2">
      <Card title="Regal · 3 Reihen × 4 Spalten">
        <div className="ex-slots">
          {SLOTS.map((x) => (
            <button
              key={x.n}
              className={"ex-slot" + (sel === x.n ? " is-active" : "") + (x.state === "empty" ? " is-empty" : "")}
              onClick={() => setSel(x.n)}
            >
              <span className="ex-slot-n">{x.n}</span>
              <span>{x.tray ?? "leer"}</span>
              {x.state === "warn" && <Badge tone="warn">prüfen</Badge>}
            </button>
          ))}
        </div>
      </Card>
      <Card title={`Slot ${s.n}`}>
        {s.tray ? (
          <>
            <KV label="Wanne" mono>{s.tray}</KV>
            <KV label="Masttag" mono>{s.day} / 14</KV>
            <KV label="Letzte Fütterung" mono>heute 06:30</KV>
            <div style={{ margin: "14px 0" }}>
              <Progress value={(s.day / 14) * 100} tone="info" />
            </div>
            <div className="ex-actions">
              <Btn variant="primary">Zur Waage</Btn>
              <Btn>Füttern</Btn>
            </div>
          </>
        ) : (
          <Empty message="Slot leer — Wanne einlagern" />
        )}
      </Card>
    </div>
  );
}

function HmiKlima() {
  const [profile, setProfile] = useState("mast");
  const [temp, setTemp] = useState("28.0");
  const [saved, setSaved] = useState(false);
  return (
    <div className="ex-grid2">
      <Card title="Sollwerte">
        <div className="ex-form">
          <Field label="Profil">
            <Select
              value={profile}
              onChange={(v) => {
                setProfile(v);
                setSaved(false);
              }}
              options={[
                { value: "mast", label: "Mast (Tag 1–14)" },
                { value: "brut", label: "Brut" },
                { value: "ruhe", label: "Ruhe / Reinigung" },
              ]}
            />
          </Field>
          <Field label="Temperatur °C" hint="Bereich 20–32">
            <Input
              type="number"
              value={temp}
              min={20}
              max={32}
              step={0.5}
              invalid={Number(temp) < 20 || Number(temp) > 32}
              onChange={(v) => {
                setTemp(v);
                setSaved(false);
              }}
            />
          </Field>
          <Btn variant="primary" onClick={() => setSaved(true)}>
            Übernehmen
          </Btn>
          {saved && (
            <Banner tone="ok" title="Übernommen">
              Neuer Sollwert {temp} °C aktiv.
            </Banner>
          )}
        </div>
      </Card>
      <Card title="Wärmepumpe">
        <KV label="Betrieb" mono>Heizen</KV>
        <KV label="Leistung el." mono>1,8 kW</KV>
        <KV label="COP" mono>3,4</KV>
        <div style={{ marginTop: 14, display: "flex", gap: 16 }}>
          <Led on label="Verdichter" />
          <Led on={false} label="Abtauen" />
        </div>
      </Card>
    </div>
  );
}

function HmiWartung() {
  const [valves, setValves] = useState({ V1: false, V2: true, Pumpe: false });
  return (
    <>
      <Banner tone="warning" title="Wartungsmodus">
        Ausgänge werden direkt geschaltet. Not-Aus in Reichweite.
      </Banner>
      <div className="ex-grid3" style={{ marginTop: 16 }}>
        {(Object.keys(valves) as (keyof typeof valves)[]).map((k) => (
          <Card key={k} title={k} right={<Led on={valves[k]} />}>
            <Btn
              variant={valves[k] ? "default" : "primary"}
              size="lg"
              onClick={() => setValves((v) => ({ ...v, [k]: !v[k] }))}
            >
              {valves[k] ? "Aus" : "Ein"}
            </Btn>
          </Card>
        ))}
      </div>
    </>
  );
}

/* ======================================================================
   Cloud — light, mouse, dense
   ====================================================================== */

type Plant = { sn: string; site: string; customer: string; status: "ok" | "warn" | "err"; fill: number; stage: number };
const PLANTS: Plant[] = [
  { sn: "SN-000241", site: "Aachen West", customer: "Hof Becker", status: "ok", fill: 82, stage: 4 },
  { sn: "SN-000242", site: "Düren Nord", customer: "Insekta GmbH", status: "warn", fill: 45, stage: 4 },
  { sn: "SN-000243", site: "Aachen West", customer: "Hof Becker", status: "err", fill: 12, stage: 3 },
  { sn: "SN-000244", site: "Köln Porz", customer: "GreenFeed", status: "ok", fill: 67, stage: 2 },
];
const STATUS_TEXT = { ok: "Betrieb", warn: "Warnung", err: "Störung" } as const;
const STATUS_TONE = { ok: "ok", warn: "warn", err: "danger" } as const;
const LIFECYCLE = [
  { label: "Hergestellt" },
  { label: "Versand" },
  { label: "Installiert" },
  { label: "Abgenommen" },
  { label: "Betrieb" },
];

type Order = { id: string; plant: string; kind: string; qty: string };

function CloudExample() {
  const [tab, setTab] = useState("anlagen");
  const [orders, setOrders] = useState<Order[]>([
    { id: "A-1031", plant: "SN-000241", kind: "Substrat", qty: "800 kg" },
  ]);
  const [wizard, setWizard] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  return (
    <div className="ex-frame ex-cloud">
      <header className="ex-cloud-top">
        <Fly height={34} dark={false} />
        <span className="ex-cloud-brand">Omnivore</span>
        <Tabs
          tabs={[
            { id: "anlagen", label: "Anlagen" },
            { id: "auftraege", label: `Aufträge (${orders.length})` },
            { id: "team", label: "Team" },
          ]}
          active={tab}
          onSelect={setTab}
          className="ex-cloud-tabs"
        />
        <Avatar size={32}>LC</Avatar>
      </header>
      <div className="ex-content">
        {done && (
          <div style={{ marginBottom: 16 }}>
            <Banner tone="ok" title="Auftrag angelegt">
              {done} ist unter Aufträge eingetragen.
            </Banner>
          </div>
        )}
        {tab === "anlagen" && <CloudPlants onNew={() => setWizard(true)} />}
        {tab === "auftraege" && <CloudOrders orders={orders} onNew={() => setWizard(true)} />}
        {tab === "team" && <CloudTeam />}
      </div>
      <OrderWizard
        open={wizard}
        onClose={() => setWizard(false)}
        onDone={(o) => {
          setOrders((xs) => [o, ...xs]);
          setDone(o.id);
          setWizard(false);
          setTab("auftraege");
        }}
        nextId={`A-${1032 + orders.length - 1}`}
      />
    </div>
  );
}

function CloudPlants({ onNew }: { onNew: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Plant | null>(PLANTS[0]);
  const rows = PLANTS.filter((p) => (p.sn + p.site + p.customer).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="ex-split">
      <Card
        title="Anlagen"
        right={
          <Btn variant="primary" size="sm" onClick={onNew}>
            Neuer Auftrag
          </Btn>
        }
      >
        <div style={{ marginBottom: 12 }}>
          <Input type="search" value={q} onChange={setQ} placeholder="Seriennummer, Standort, Kunde …" />
        </div>
        {rows.length === 0 ? (
          <Empty message="Keine Anlage passt zur Suche" />
        ) : (
          <Table
            columns={[
              { key: "sn", header: "Seriennr.", render: (r: Plant) => <span className="ex-mono">{r.sn}</span> },
              { key: "site", header: "Standort", render: (r: Plant) => r.site },
              {
                key: "st",
                header: "Status",
                render: (r: Plant) => (
                  <Badge tone={STATUS_TONE[r.status]} dot>
                    {STATUS_TEXT[r.status]}
                  </Badge>
                ),
              },
              { key: "fill", header: "Füllstand", render: (r: Plant) => <Progress value={r.fill} /> },
            ]}
            columnsTemplate="1.1fr 1fr 0.9fr 1fr"
            rows={rows}
            rowKey={(r) => r.sn}
            onRowClick={setSel}
          />
        )}
      </Card>
      <Card title={sel ? sel.sn : "Anlage"}>
        {sel ? (
          <>
            <KV label="Kunde">{sel.customer}</KV>
            <KV label="Standort">{sel.site}</KV>
            <KV label="Füllstand" mono>{sel.fill} %</KV>
            <div style={{ marginTop: 18 }}>
              <Stepper steps={LIFECYCLE} current={sel.stage} />
            </div>
            {sel.status === "err" && (
              <div style={{ marginTop: 16 }}>
                <Banner tone="danger" title="Störung seit 13:47">
                  Encoder Y1 meldet 0. Service ist informiert.
                </Banner>
              </div>
            )}
          </>
        ) : (
          <Empty message="Anlage in der Liste wählen" />
        )}
      </Card>
    </div>
  );
}

function CloudOrders({ orders, onNew }: { orders: Order[]; onNew: () => void }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);
  return (
    <Card
      title="Aufträge"
      right={
        <Btn variant="primary" size="sm" onClick={onNew}>
          Neuer Auftrag
        </Btn>
      }
    >
      {loading ? (
        <div style={{ display: "grid", gap: 10 }}>
          <Skeleton height={18} />
          <Skeleton height={18} width="80%" />
          <Skeleton height={18} width="60%" />
        </div>
      ) : (
        <Table
          columns={[
            { key: "id", header: "Nr.", render: (r: Order) => <span className="ex-mono">{r.id}</span> },
            { key: "plant", header: "Anlage", render: (r: Order) => r.plant },
            { key: "kind", header: "Art", render: (r: Order) => <Badge tone="info">{r.kind}</Badge> },
            { key: "qty", header: "Menge", render: (r: Order) => r.qty },
          ]}
          rows={orders}
          rowKey={(r) => r.id}
        />
      )}
    </Card>
  );
}

function CloudTeam() {
  const people = [
    { ini: "LC", name: "Leonard", role: "Betreiber", tone: "primary" as const },
    { ini: "HB", name: "Hof Becker", role: "Kunde", tone: "neutral" as const },
    { ini: "SV", name: "Service", role: "Techniker", tone: "info" as const },
  ];
  return (
    <div className="ex-grid2">
      <Card title="Mitglieder">
        <div className="ex-list">
          {people.map((p) => (
            <div key={p.ini} className="ex-list-row">
              <Avatar size={32}>{p.ini}</Avatar>
              <span style={{ flex: 1 }}>{p.name}</span>
              <Badge tone={p.tone}>{p.role}</Badge>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Offene Einladungen">
        <Empty message="Keine offenen Einladungen" />
      </Card>
    </div>
  );
}

function OrderWizard({
  open,
  onClose,
  onDone,
  nextId,
}: {
  open: boolean;
  onClose: () => void;
  onDone: (o: Order) => void;
  nextId: string;
}) {
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState("Substrat");
  const [plant, setPlant] = useState(PLANTS[0].sn);
  const [qty, setQty] = useState("500");
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);
  const qtyBad = !(Number(qty) > 0);

  const body: ReactNode[] = [
    <div key="0" className="ex-form">
      {[
        ["Substrat", "Futter-Substrat nachliefern"],
        ["Wannen", "Leere Wannen tauschen"],
        ["Service", "Techniker-Einsatz"],
      ].map(([k, d]) => (
        <RadioCard key={k} selected={kind === k} onSelect={() => setKind(k)}>
          <strong>{k}</strong>
          <div className="ex-hint">{d}</div>
        </RadioCard>
      ))}
    </div>,
    <div key="1" className="ex-form">
      <Field label="Anlage">
        <Select value={plant} onChange={setPlant} options={PLANTS.map((p) => ({ value: p.sn, label: `${p.sn} · ${p.site}` }))} />
      </Field>
      <Field label="Menge (kg)" error={qtyBad ? "Menge größer 0 eingeben" : undefined}>
        <Input type="number" value={qty} onChange={setQty} invalid={qtyBad} />
      </Field>
    </div>,
    <div key="2">
      <KV label="Nr." mono>{nextId}</KV>
      <KV label="Art">{kind}</KV>
      <KV label="Anlage" mono>{plant}</KV>
      <KV label="Menge" mono>{qty} kg</KV>
    </div>,
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Neuer Auftrag"
      width={520}
      footer={
        <>
          <Btn variant="ghost" onClick={step === 0 ? onClose : () => setStep(step - 1)}>
            {step === 0 ? "Abbrechen" : "Zurück"}
          </Btn>
          {step < 2 ? (
            <Btn variant="primary" disabled={step === 1 && qtyBad} onClick={() => setStep(step + 1)}>
              Weiter
            </Btn>
          ) : (
            <Btn variant="primary" onClick={() => onDone({ id: nextId, plant, kind, qty: `${qty} kg` })}>
              Auftrag anlegen
            </Btn>
          )}
        </>
      }
    >
      <div style={{ marginBottom: 20 }}>
        <Stepper steps={[{ label: "Art" }, { label: "Details" }, { label: "Prüfen" }]} current={step} />
      </div>
      {body[step]}
    </Modal>
  );
}
