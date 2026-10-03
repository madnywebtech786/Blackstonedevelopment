import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoData = await readFile(
  join(process.cwd(), "public/images/logo.png"),
  "base64"
);
const logoSrc = `data:image/png;base64,${logoData}`;
const serviceAreasLine = `Serving ${siteConfig.serviceAreas.slice(0, 4).join(" · ")}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#14161a",
          backgroundImage:
            "radial-gradient(circle at 18% 20%, rgba(194,29,46,0.35), transparent 42%), radial-gradient(circle at 85% 85%, rgba(194,29,46,0.25), transparent 45%)",
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: "#ffffff",
            borderRadius: 24,
            padding: "40px 64px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={520} height={237} alt="" />
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 34,
            color: "#ffffff",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 24,
            color: "rgba(255,255,255,0.65)",
          }}
        >
          {serviceAreasLine}
        </div>
      </div>
    ),
    { ...size }
  );
}
