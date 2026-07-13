import { useState, Fragment, type ReactNode } from "react";
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

// Which surface's catalog to show. The Components page is a per-surface catalog
// (option B, "stronger split"): the dark-industrial HMI and the light-cloud
// dashboard each see only the primitives they actually use. A few workhorses
// are shared ("both"); Stat/Led are HMI-only; forms/Modal/Stepper/Avatar/etc.
// are cloud-only. Tags live on each demo below.
export type Surface = "hmi" | "cloud";
const BOTH: Surface[] = ["hmi", "cloud"];
const HMI: Surface[] = ["hmi"];
const CLOUD: Surface[] = ["cloud"];

// Small layout helpers (gallery chrome only — not part of the library).
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: 44 }}>
      <div className="omv-eyebrow" style={{ marginBottom: 14 }}>
        {title}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        {children}
      </div>
    </section>
  );
}

function Box({ children, width }: { children: ReactNode; width?: number }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        background: "var(--surface)",
        padding: 18,
        width,
        minWidth: 240,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {children}
    </div>
  );
}

const ROWS = [
  { sn: "SN-000241", site: "Aachen West", status: "ok" as const },
  { sn: "SN-000242", site: "Dueren Nord", status: "warn" as const },
  { sn: "SN-000243", site: "Aachen West", status: "err" as const },
];

const STEPS = [
  { label: "Manufactured", sublabel: "Hergestellt" },
  { label: "In logistics", sublabel: "Im Versand" },
  { label: "Installed", sublabel: "Installiert" },
  { label: "Commissioned", sublabel: "Abgenommen" },
  { label: "Operational", sublabel: "Betrieb" },
];

export function Gallery({ surface }: { surface: Surface }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [site, setSite] = useState("aachen");
  const [tab, setTab] = useState("overview");
  const [plan, setPlan] = useState("balanced");
  const [search, setSearch] = useState("");

  const isHmi = surface === "hmi";

  // Each demo is tagged with the surfaces whose catalog includes it. Filtering
  // by the active surface is all it takes to render the right catalog.
  const demos: { id: string; surfaces: Surface[]; node: ReactNode }[] = [
    {
      id: "Btn",
      surfaces: BOTH,
      node: (
        <Section title="Btn">
          <Box>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Btn variant="primary">Primary</Btn>
              <Btn>Secondary</Btn>
              <Btn variant="ghost">Ghost</Btn>
              <Btn variant="danger">Delete</Btn>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <Btn variant="primary" size="sm">
                Small
              </Btn>
              <Btn variant="primary" size="md">
                Medium
              </Btn>
              <Btn variant="primary" size="lg">
                Large
              </Btn>
              <Btn variant="primary" disabled>
                Disabled
              </Btn>
            </div>
          </Box>
        </Section>
      ),
    },
    {
      id: "Badge",
      surfaces: BOTH,
      node: (
        <Section title="Badge">
          <Box>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Badge tone="primary" dot>
                Commissioned
              </Badge>
              <Badge tone="ok" dot>
                Operational
              </Badge>
              <Badge tone="warn" dot>
                Installed
              </Badge>
              <Badge tone="danger" dot>
                Fault
              </Badge>
              <Badge tone="info" dot>
                In logistics
              </Badge>
              <Badge tone="neutral">Retired</Badge>
            </div>
          </Box>
        </Section>
      ),
    },
    {
      id: "Led",
      surfaces: HMI,
      node: (
        <Section title="Led">
          <Box>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              <Led on label="Pump A" />
              <Led on={false} label="Gripper" />
            </div>
          </Box>
        </Section>
      ),
    },
    {
      id: "Banner",
      surfaces: BOTH,
      node: (
        <Section title="Banner">
          <Box width={460}>
            <Banner tone="ok" title="Batch complete">
              6 trays filled and weighed.
            </Banner>
            <Banner tone="warning" title="Axes not synced">
              Home the gantry before manual moves.
            </Banner>
            <Banner tone="danger" title="Gripper fault 504">
              Harvest halted at slot B4.
            </Banner>
            <Banner tone="info" title="New firmware">
              PLC update staged for next flash.
            </Banner>
          </Box>
        </Section>
      ),
    },
    {
      id: "Progress",
      surfaces: BOTH,
      node: (
        <Section title="Progress">
          <Box width={320}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="omv-meta">Fill batch · 68%</span>
              <Progress value={68} tone="primary" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="omv-meta">Buffer · 40%</span>
              <Progress value={40} tone="info" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="omv-meta">Temp threshold · 88%</span>
              <Progress value={88} tone="warning" />
            </div>
          </Box>
        </Section>
      ),
    },
    {
      id: "Inputs",
      surfaces: CLOUD,
      node: (
        <Section title="Field · Input · Select">
          <Box width={320}>
            <Field label="Search containers">
              <Input
                value={search}
                onChange={setSearch}
                placeholder="Serial or site…"
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" />
                  </svg>
                }
              />
            </Field>
            <Field label="Site">
              <Select
                value={site}
                onChange={setSite}
                options={[
                  { value: "aachen", label: "Aachen West" },
                  { value: "dueren", label: "Dueren Nord" },
                ]}
              />
            </Field>
            <Field label="Weight target" error="Must be a positive number.">
              <Input value="-12" invalid onChange={() => {}} />
            </Field>
          </Box>
        </Section>
      ),
    },
    {
      id: "Tabs",
      surfaces: BOTH,
      node: (
        <Section title="Tabs">
          <Box width={360}>
            <Tabs
              active={tab}
              onSelect={setTab}
              tabs={[
                { id: "overview", label: "Overview" },
                { id: "jobs", label: "Jobs" },
                { id: "events", label: "Events" },
              ]}
            />
            <span className="omv-meta">Active: {tab}</span>
          </Box>
        </Section>
      ),
    },
    {
      id: "RadioCard",
      surfaces: CLOUD,
      node: (
        <Section title="RadioCard">
          {[
            { id: "mvp", title: "MVP first", body: "Ship the smallest slice." },
            { id: "balanced", title: "Balanced", body: "Reasonable coverage now." },
            { id: "robust", title: "Robust", body: "Handle every edge up front." },
          ].map((o) => (
            <RadioCard
              key={o.id}
              selected={plan === o.id}
              onSelect={() => setPlan(o.id)}
              className=""
            >
              <div style={{ fontWeight: 600 }}>{o.title}</div>
              <div className="omv-meta">{o.body}</div>
            </RadioCard>
          ))}
        </Section>
      ),
    },
    {
      id: "Table",
      surfaces: BOTH,
      node: (
        <Section title="Table">
          <div style={{ width: "100%", maxWidth: 560 }}>
            <Table
              rows={ROWS}
              rowKey={(r) => r.sn}
              columns={[
                {
                  key: "sn",
                  header: "Serial",
                  width: "1.2fr",
                  render: (r) => <span className="omv-mono">{r.sn}</span>,
                },
                { key: "site", header: "Site", width: "1fr", render: (r) => r.site },
                {
                  key: "st",
                  header: "Status",
                  width: "0.8fr",
                  render: (r) => (
                    <Badge tone={r.status === "ok" ? "ok" : r.status === "warn" ? "warn" : "danger"} dot>
                      {r.status}
                    </Badge>
                  ),
                },
              ]}
            />
          </div>
        </Section>
      ),
    },
    {
      id: "Stepper",
      surfaces: CLOUD,
      node: (
        <Section title="Card · Stepper">
          <div style={{ width: "100%" }}>
            <Card title="Container lifecycle">
              <Stepper current={2} steps={STEPS} />
            </Card>
          </div>
        </Section>
      ),
    },
    {
      id: "CardStat",
      surfaces: HMI,
      node: (
        <Section title="Card · Stat">
          <Card title="Achse Z" right={<Led on label="bereit" />}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Stat label="Position" value="412.7" unit="mm" hint="Ziel 415.0" />
              <Stat label="Last" value="42.1" unit="kg" tone="ok" />
              <Stat label="Temp" value="61" unit="°C" tone="warn" />
              <Stat label="Fehler" value="504" tone="err" hint="Greifer-Fault" />
            </div>
          </Card>
        </Section>
      ),
    },
    {
      id: "People",
      surfaces: CLOUD,
      node: (
        <Section title="Avatar · KV · Skeleton">
          <Box width={260}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Avatar size={40}>LC</Avatar>
              <KV label="Operator">Leonard Classen</KV>
            </div>
            <KV label="Serial" mono>
              SN-OMV-000241
            </KV>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span className="omv-kv-label">Loading…</span>
              <Skeleton height={12} width="80%" />
              <Skeleton height={12} width="55%" />
            </div>
          </Box>
        </Section>
      ),
    },
    {
      id: "Empty",
      surfaces: BOTH,
      node: (
        <Section title="Empty">
          <Box width={260}>
            <Empty message="Keine aktiven Jobs" />
          </Box>
        </Section>
      ),
    },
    {
      id: "Modal",
      surfaces: CLOUD,
      node: (
        <Section title="Modal">
          <Box width={260}>
            <Btn variant="primary" onClick={() => setModalOpen(true)}>
              Open modal
            </Btn>
            <span className="omv-meta">Real Escape / scrim-close.</span>
          </Box>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Retire container SN-OMV-000241?"
            width={440}
            footer={
              <>
                <Btn onClick={() => setModalOpen(false)}>Cancel</Btn>
                <Btn variant="danger" onClick={() => setModalOpen(false)}>
                  Retire
                </Btn>
              </>
            }
          >
            This moves the container to <em>Retired</em> and stops telemetry ingestion. You can
            re-commission it later. Press Escape or click the scrim to close.
          </Modal>
        </Section>
      ),
    },
  ];

  const visible = demos.filter((d) => d.surfaces.includes(surface));

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px 96px" }}>
      <header>
        <h1 className="omv-h1">{isHmi ? "Industrial catalog" : "Customer-ops catalog"}</h1>
        <p className="omv-meta" style={{ marginTop: 4, maxWidth: "64ch" }}>
          {isHmi ? (
            <>
              The primitives the <strong>WAGO-panel HMI</strong> uses — this catalog is filtered to the
              dark-industrial surface. Switch to <span className="omv-mono">Light · Cloud</span> for the
              broader customer-ops set.
            </>
          ) : (
            <>
              The primitives the <strong>customer-ops cloud dashboard</strong> uses — this catalog is
              filtered to the light-cloud surface. Switch to <span className="omv-mono">Dark · Industrial</span>{" "}
              for the leaner HMI set.
            </>
          )}
        </p>
      </header>

      {visible.map((d) => (
        <Fragment key={d.id}>{d.node}</Fragment>
      ))}
    </div>
  );
}
