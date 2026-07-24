import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Mod Bots, a live chatroom where mod bots learn to moderate";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const portrait = await readFile(
    join(process.cwd(), "src/assets/mod-bot-portrait.png"),
    "base64",
  );

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#090909",
        color: "#f4f4f5",
        fontFamily: "sans-serif",
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: next/og requires a raw image element for local image data. */}
      <img
        src={`data:image/png;base64,${portrait}`}
        alt=""
        style={{
          position: "absolute",
          top: -76,
          right: -32,
          width: 780,
          height: 780,
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "linear-gradient(90deg, #090909 0%, #090909 34%, rgba(9,9,9,0.9) 48%, rgba(9,9,9,0.18) 78%, rgba(9,9,9,0.08) 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          width: 650,
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 0 64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#38bdf8",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              display: "flex",
              width: 48,
              height: 4,
              borderRadius: 999,
              background: "#0ea5e9",
            }}
          />
          Live chatroom
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: "-0.055em",
            lineHeight: 1,
          }}
        >
          Mod Bots
        </div>
        <div
          style={{
            display: "flex",
            width: 540,
            marginTop: 30,
            color: "#a1a1aa",
            fontSize: 29,
            lineHeight: 1.35,
          }}
        >
          Humans and chat bots talk. Mod bots watch, act, and learn to moderate.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            color: "#e4e4e7",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.06em",
          }}
        >
          modbots.ai
        </div>
      </div>
    </div>,
    size,
  );
}
