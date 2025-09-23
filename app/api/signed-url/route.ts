import { NextResponse } from "next/server"

export async function GET() {
  try {
    const agentId = process.env.AGENT_ID
    const apiKey = process.env.ELEVENLABS_API_KEY

    console.log("Environment check:", {
      hasAgentId: !!agentId,
      hasApiKey: !!apiKey,
      agentIdLength: agentId ? agentId.length : 0,
      nodeEnv: process.env.NODE_ENV,
    })

    if (!apiKey) {
      console.error("ELEVENLABS_API_KEY environment variable is not set")
      return NextResponse.json(
        {
          error: "ELEVENLABS_API_KEY is not configured",
          details: "Please set the ELEVENLABS_API_KEY environment variable with your ElevenLabs API key.",
        },
        { status: 400 },
      )
    }

    if (!agentId) {
      console.error("AGENT_ID environment variable is not set")
      return NextResponse.json(
        {
          error: "AGENT_ID is not configured",
          details: "Please set the AGENT_ID environment variable with your ElevenLabs agent ID.",
        },
        { status: 400 },
      )
    }

    console.log("Making request to ElevenLabs API...")

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
      },
    )

    console.log("ElevenLabs API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ElevenLabs API error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })

      return NextResponse.json(
        {
          error: `ElevenLabs API error: ${response.status} ${response.statusText}`,
          details: errorText,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("Successfully got signed URL from ElevenLabs")

    return NextResponse.json({ signedUrl: data.signed_url })
  } catch (error) {
    console.error("Detailed error in signed-url route:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error: error,
    })

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
