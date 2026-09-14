import { ImageResponse } from "next/og";

export const alt = "nextjs-boilerplate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090b",
        color: "#fafafa",
        fontSize: 72,
        fontWeight: 600,
      }}
    >
      nextjs-boilerplate
    </div>,
    { ...size },
  );
}
