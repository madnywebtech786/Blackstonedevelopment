import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        <span style={{ color: "#c21d2e" }}>B</span>
        <span style={{ color: "#14161a" }}>S</span>
      </div>
    ),
    { ...size }
  );
}
