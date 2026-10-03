import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          fontSize: 100,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        <span style={{ color: "#c21d2e" }}>B</span>
        <span style={{ color: "#14161a" }}>S</span>
      </div>
    ),
    { ...size }
  );
}
