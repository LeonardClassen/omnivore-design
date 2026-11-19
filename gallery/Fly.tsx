import bodyUrl from "../assets/logo/flach/fliege-koerper.png";
import wingsUrl from "../assets/logo/flach/fliege-fluegel.png";
import glitterUrl from "../assets/logo/1zu1/fliege-dunkel-192.png";

// The Omnivore fly, theme-aware:
//  - light ground: the flat logo fly (V6a). Wings are a CSS mask filled with
//    var(--brand), so the mark always carries the current brand green.
//  - dark ground: the Glitzer-Fliege cut-out, no added glow.
export function Fly({ height, dark }: { height: number; dark: boolean }) {
  if (dark) return <img src={glitterUrl} alt="Omnivore" style={{ height, width: "auto", display: "block" }} />;
  const mask = `url(${wingsUrl}) center / contain no-repeat`;
  return (
    <span
      role="img"
      aria-label="Omnivore"
      style={{ position: "relative", display: "block", height, aspectRatio: "439 / 625", flex: "none" }}
    >
      <span
        style={{ position: "absolute", inset: 0, background: "var(--brand)", WebkitMask: mask, mask }}
      />
      <img src={bodyUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </span>
  );
}
