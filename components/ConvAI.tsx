"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useConversation } from "@elevenlabs/react"
import { cn } from "@/lib/utils"
import { Code } from "@/components/Code"

async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true })
    return true
  } catch (error) {
    console.error("Microphone permission denied:", error)
    return false
  }
}

async function checkEnvironment() {
  try {
    const response = await fetch("/api/test-env")
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error checking environment:", error)
    return null
  }
}

async function getSignedUrl(): Promise<{ signedUrl: string; isDemo?: boolean }> {
  try {
    console.log("[v0] Fetching signed URL...")
    console.log("[v0] Current domain:", window.location.hostname)
    console.log("[v0] Current protocol:", window.location.protocol)

    const response = await fetch("/api/signed-url")

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response ok:", response.ok)

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
        console.log("[v0] Error response data:", errorData)
      } catch {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
      }

      console.error("[v0] API response error:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      })

      if (
        response.status === 400 &&
        (errorData.error?.includes("ELEVENLABS_API_KEY") || errorData.error?.includes("AGENT_ID"))
      ) {
        throw new Error(
          `Configuration Error: ${errorData.error}. Please add the missing environment variables to your Vercel deployment.`,
        )
      }

      throw new Error(errorData.details || errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] Successfully got signed URL response:", { hasSignedUrl: !!data.signedUrl, isDemo: data.isDemo })

    if (!data.signedUrl) {
      throw new Error("No signed URL in response")
    }

    return { signedUrl: data.signedUrl, isDemo: data.isDemo }
  } catch (error) {
    console.error("[v0] Error in getSignedUrl:", error)
    throw error
  }
}

export function ConvAI() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [envStatus, setEnvStatus] = useState<any>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    checkEnvironment().then(setEnvStatus)
  }, [])

  const conversation = useConversation({
    mode: "webrtc",
    onConnect: () => {
      console.log("[v0] Connected to conversation")
      setError(null)
    },
    onDisconnect: () => {
      console.log("[v0] Disconnected from conversation")
      setIsLoading(false)
    },
    onError: (error) => {
      console.error("[v0] Conversation error:", error)
      console.log("[v0] Error details:", {
        message: error.message,
        code: error.code,
        type: error.type,
        stack: error.stack,
      })
      if (isDemoMode) {
        setError("Demo mode: This is a placeholder connection. Set up your AGENT_ID for real functionality.")
      } else {
        setError(`Conversation error: ${error.message || "Unknown error"}`)
      }
      setIsLoading(false)
    },
    onMessage: (message) => {
      console.log("[v0] Message received:", message)
    },
  })

  async function startConversation() {
    try {
      setIsLoading(true)
      setError(null)

      console.log("[v0] Starting conversation flow...")
      console.log("[v0] Requesting microphone permission...")
      const hasPermission = await requestMicrophonePermission()
      if (!hasPermission) {
        setError("Microphone permission is required for voice conversation")
        setIsLoading(false)
        return
      }

      console.log("[v0] Getting signed URL...")
      const { signedUrl, isDemo } = await getSignedUrl()

      if (isDemo) {
        setIsDemoMode(true)
        setError(
          "Demo mode: Using placeholder agent ID. Set up your AGENT_ID environment variable for real functionality.",
        )
        setIsLoading(false)
        return
      }

      console.log("[v0] Got signed URL, starting session...")
      console.log("[v0] Signed URL domain:", new URL(signedUrl).hostname)

      try {
        const urlObj = new URL(signedUrl)
        console.log("[v0] Signed URL details:", {
          protocol: urlObj.protocol,
          hostname: urlObj.hostname,
          pathname: urlObj.pathname,
          hasSearchParams: urlObj.search.length > 0,
        })
      } catch (urlError) {
        console.error("[v0] Invalid signed URL format:", urlError)
        throw new Error("Received invalid signed URL from server")
      }

      console.log("[v0] Calling conversation.startSession...")
      try {
        await conversation.startSession({ signedUrl })
        console.log("[v0] Session started successfully")
      } catch (sessionError) {
        console.error("[v0] Error in startSession:", sessionError)
        console.log("[v0] Session error details:", {
          message: sessionError instanceof Error ? sessionError.message : String(sessionError),
          name: sessionError instanceof Error ? sessionError.name : undefined,
          stack: sessionError instanceof Error ? sessionError.stack : undefined,
          // @ts-ignore - checking for additional error properties
          code: sessionError?.code,
          // @ts-ignore
          type: sessionError?.type,
          // @ts-ignore
          details: sessionError?.details,
        })
        throw sessionError
      }

      setIsLoading(false)
    } catch (error) {
      console.error("[v0] Error starting conversation:", error)
      console.log("[v0] Full error object:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      })
      const errorMessage = error instanceof Error ? error.message : "Failed to start conversation"
      setError(`${errorMessage}${errorMessage.includes("Configuration") ? "" : ". Check browser console for details."}`)
      setIsLoading(false)
    }
  }

  async function stopConversation() {
    try {
      setIsLoading(true)
      await conversation.endSession()
      setError(null)
      setIsDemoMode(false)
    } catch (error) {
      console.error("Error stopping conversation:", error)
      setError(error instanceof Error ? error.message : "Failed to stop conversation")
    } finally {
      setIsLoading(false)
    }
  }

  // Check if error is related to missing environment variables
  const isConfigError = error?.includes("AGENT_ID") || error?.includes("ELEVENLABS_API_KEY")

  return (
    <div className={"flex justify-center items-center gap-x-4"}>
      <Card className={"rounded-3xl max-w-2xl"}>
        <CardContent>
          <CardHeader>
            <CardTitle className={"text-center text-2xl font-bold"}>
              {isDemoMode
                ? "ElevenLabs Agents - Demo Mode"
                : conversation.status === "connected"
                  ? conversation.isSpeaking
                    ? `Agent is speaking`
                    : "Agent is listening"
                  : "ElevenLabs Agents"}
            </CardTitle>
          </CardHeader>
          <div className={"flex flex-col gap-y-4 text-center items-center"}>
            <div className="flex justify-center w-full">
              <div
                className={cn(
                  "orb",
                  isDemoMode
                    ? "orb-inactive"
                    : conversation.status === "connected" && conversation.isSpeaking
                      ? "orb-active animate-orb"
                      : conversation.status === "connected"
                        ? "animate-orb-slow orb-inactive"
                        : "orb-inactive",
                )}
              ></div>
            </div>

            {/* Environment Status Debug Info */}
            {envStatus && (
              <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded border text-left w-full max-w-md">
                <div className="font-medium mb-1">Environment Status:</div>
                <div>Has AGENT_ID: {envStatus.hasAgentId ? "✅" : "❌ (using demo placeholder)"}</div>
                <div>Has ELEVENLABS_API_KEY: {envStatus.hasElevenLabsKey ? "✅" : "❌"}</div>
                <div>Agent ID: {envStatus.agentIdValue}</div>
                {envStatus.allEnvKeys.length > 0 && <div>Available env keys: {envStatus.allEnvKeys.join(", ")}</div>}
              </div>
            )}

            {error && (
              <div
                className={cn(
                  "text-sm p-3 rounded-md border max-w-md mx-auto text-left",
                  isDemoMode
                    ? "text-orange-600 bg-orange-50 border-orange-200"
                    : "text-red-500 bg-red-50 border-red-200",
                )}
              >
                <div className="font-medium mb-2">{isDemoMode ? "Demo Mode:" : "Configuration Error:"}</div>
                <div className="mb-3">{error}</div>

                {(isConfigError || isDemoMode) && (
                  <div className="text-xs text-gray-600 space-y-2">
                    <div>To enable full functionality:</div>
                    <div className="space-y-1">
                      <div>
                        1. Get your API key from{" "}
                        <a
                          href="https://elevenlabs.io"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          ElevenLabs
                        </a>
                      </div>
                      <div>2. Create a conversational AI agent and copy the Agent ID</div>
                      <div>3. Set environment variables in your deployment:</div>
                      <div className="ml-2 space-y-1">
                        <div>
                          <Code>ELEVENLABS_API_KEY=your_api_key</Code>
                        </div>
                        <div>
                          <Code>AGENT_ID=your_agent_id</Code>
                        </div>
                      </div>
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                        <div className="font-medium text-blue-800 mb-1">For Vercel Deployment:</div>
                        <div className="text-blue-700 space-y-1">
                          <div>1. Go to your Vercel dashboard</div>
                          <div>
                            2. Select your project: <Code>elevenlabs-book-agent</Code>
                          </div>
                          <div>3. Go to Settings → Environment Variables</div>
                          <div>4. Add both variables and redeploy</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              variant={"outline"}
              className={"rounded-full"}
              size={"lg"}
              disabled={isLoading || (conversation !== null && conversation.status === "connected")}
              onClick={startConversation}
            >
              {isLoading ? "Starting..." : isDemoMode ? "Try Demo" : "Start conversation"}
            </Button>
            <Button
              variant={"outline"}
              className={"rounded-full"}
              size={"lg"}
              disabled={isLoading || (conversation === null && !isDemoMode)}
              onClick={stopConversation}
            >
              {isLoading ? "Stopping..." : "End conversation"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
