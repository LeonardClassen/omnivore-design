import { useState, type ReactNode } from "react";
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

export function Gallery() {
  const [modalOpen, setModalOpen] = useState(false);
  const [site, setSite] = useState("aachen");
  const [tab, setTab] = useState("overview");
  const [plan, setPlan] = useState("balanced");
  const [search, setSearch] = useState("");

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px 96px" }}>
      {/* Header + theme toggle */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 className="omv-h1">Component Gallery</h1>
          <p className="omv-meta" style={{ marginTop: 4 }}>
            The actual <span className="omv-mono">ui/src</span> React components — 19 primitives,
            both themes. This is the live reference the HMI + cloud reuse.
          </p>
        </div>
      </header>

      {/* Buttons */}
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

      {/* Badges + LEDs */}
      <Section title="Badge · Led">
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
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <Led on label="Pump A" />
            <Led on={false} label="Gripper" />
          </div>
        </Box>
      </Section>

      {/* Banners */}
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

      {/* Progress */}
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

      {/* Inputs */}
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

      {/* Tabs */}
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

      {/* Radio cards */}
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

      {/* Table */}
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

      {/* Stepper */}
      <Section title="Stepper">
        <div style={{ width: "100%" }}>
          <Card title="Container lifecycle">
            <Stepper current={2} steps={STEPS} />
          </Card>
        </div>
      </Section>

      {/* Card + Stat + KV + Avatar + Skeleton + Empty + Modal */}
      <Section title="Card · Stat · KV · Avatar · Skeleton · Empty · Modal">
        <Card title="Achse Z" right={<Led on label="bereit" />}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Stat label="Position" value="412.7" unit="mm" hint="Ziel 415.0" />
            <Stat label="Last" value="42.1" unit="kg" tone="ok" />
            <Stat label="Temp" value="61" unit="°C" tone="warn" />
            <Stat label="Fehler" value="504" tone="err" hint="Greifer-Fault" />
          </div>
        </Card>
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
        <Box width={260}>
          <Empty message="Keine aktiven Jobs" />
        </Box>
        <Box width={260}>
          <Btn variant="primary" onClick={() => setModalOpen(true)}>
            Open modal
          </Btn>
          <span className="omv-meta">Real Escape / scrim-close.</span>
        </Box>
      </Section>

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
    </div>
  );
}
