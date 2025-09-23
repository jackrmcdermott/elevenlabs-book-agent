export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const agentId = url.searchParams.get("agent_id") || process.env.AGENT_ID

    if (!agentId) {
      return Response.json({
        signedUrl: "demo://placeholder",
        isDemo: true,
      })
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return Response.json({
        signedUrl: "demo://placeholder",
        isDemo: true,
      })
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] ElevenLabs API error:", response.status, errorText)
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Generated signed URL for agent")

    return Response.json({
      signedUrl: data.signed_url,
      isDemo: false,
    })
  } catch (error) {
    console.error("[v0] Error generating signed URL:", error)
    return Response.json(
      {
        error: "Failed to generate signed URL",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Keep POST for backward compatibility
export async function POST(req: Request) {
  try {
    const { agentId } = await req.json()
    const targetAgentId = agentId || process.env.AGENT_ID

    if (!targetAgentId) {
      return Response.json({
        signedUrl: "demo://placeholder",
        isDemo: true,
      })
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return Response.json({
        signedUrl: "demo://placeholder",
        isDemo: true,
      })
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${targetAgentId}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] ElevenLabs API error:", response.status, errorText)
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Generated signed URL for agent")

    return Response.json({
      signedUrl: data.signed_url,
      isDemo: false,
    })
  } catch (error) {
    console.error("[v0] Error generating signed URL:", error)
    return Response.json(
      {
        error: "Failed to generate signed URL",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
