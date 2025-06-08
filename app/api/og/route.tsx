import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get("title") || "My Personal Website"
  const description = searchParams.get("description") || "Developer, writer, and creator."
  const type = searchParams.get("type") || "website"

  // Instead of loading a custom font, we'll use a system font
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f4f5",
        padding: "40px",
        fontFamily: "system-ui, sans-serif", // Using system font instead
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "40px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "90%",
          height: "80%",
        }}
      >
        <div
          style={{
            fontSize: "60px",
            fontWeight: "bold",
            color: "#18181b",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "30px",
            color: "#71717a",
            textAlign: "center",
            maxWidth: "80%",
          }}
        >
          {description}
        </div>
        <div
          style={{
            marginTop: "40px",
            fontSize: "24px",
            color: "#3f3f46",
            padding: "8px 24px",
            borderRadius: "4px",
            backgroundColor: "#f4f4f5",
          }}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
