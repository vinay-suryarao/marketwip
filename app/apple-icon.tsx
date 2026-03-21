import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

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
          background: "#060B19",
          border: "4px solid #1A2552",
          borderRadius: 28,
        }}
      >
        <div
          style={{
            width: 116,
            height: 82,
            borderRadius: 14,
            background: "#0A102E",
            border: "2px solid #1A2552",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingLeft: 22,
            paddingRight: 22,
            paddingBottom: 14,
          }}
        >
          <div style={{ width: 16, height: 26, borderRadius: 4, background: "#4353FF" }} />
          <div style={{ width: 16, height: 36, borderRadius: 4, background: "#C100FF" }} />
          <div style={{ width: 16, height: 46, borderRadius: 4, background: "#00F0FF" }} />
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
