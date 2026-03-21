import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

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
          background: "#060B19",
          border: "2px solid #1A2552",
          borderRadius: 12,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: 42,
            height: 30,
            borderRadius: 7,
            background: "#0A102E",
            border: "1px solid #1A2552",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingLeft: 8,
            paddingRight: 8,
            paddingBottom: 6,
          }}
        >
          <div style={{ width: 6, height: 10, borderRadius: 2, background: "#4353FF" }} />
          <div style={{ width: 6, height: 14, borderRadius: 2, background: "#C100FF" }} />
          <div style={{ width: 6, height: 18, borderRadius: 2, background: "#00F0FF" }} />
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
