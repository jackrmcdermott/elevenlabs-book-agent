import { NextResponse } from "next/server"

export async function GET() {
  try {
    const agentId = process.env.AGENT_ID
    const apiKey = process.env.ELEVENLABS_API_KEY

    // Don't expose the actual values, just check if they exist
    const debugInfo = {
      hasAgentId: !!agentId,
      hasApiKey: !!apiKey,
      agentIdLength: agentId ? agentId.length : 0,
      apiKeyLength: apiKey ? apiKey.length : 0,
      agentIdPrefix: agentId ? agentId.substring(0, 8) + "..." : "undefined",
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    }

    console.log("Debug environment check:", debugInfo)

    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error("Debug endpoint error:", error)
    return NextResponse.json(
      {
        error: "Debug endpoint failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
