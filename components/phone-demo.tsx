"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Search, Share, MoreHorizontal, Play, Pause, SkipBack, SkipForward, X, Phone } from "lucide-react"
import { gatsbyContent } from "@/lib/gatsby-content"
import { useConversation } from "@elevenlabs/react"

async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true })
    return true
  } catch (error) {
    console.error("Microphone permission denied:", error)
    return false
  }
}

async function getSignedUrl(): Promise<{ signedUrl: string; isDemo?: boolean }> {
  try {
    console.log("Fetching signed URL...")
    const response = await fetch("/api/signed-url")

    console.log("Response status:", response.status)
    console.log("Response ok:", response.ok)

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
      }

      console.error("API response error:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      })

      throw new Error(errorData.details || errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Successfully got signed URL")

    if (!data.signedUrl) {
      throw new Error("No signed URL in response")
    }

    return { signedUrl: data.signedUrl, isDemo: data.isDemo }
  } catch (error) {
    console.error("Error in getSignedUrl:", error)
    throw error
  }
}

export default function PhoneDemo() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [currentChapter, setCurrentChapter] = useState("Chapter I")
  const [currentParagraph, setCurrentParagraph] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [firstName, setFirstName] = useState("Jack")
  const [selectedVoice, setSelectedVoice] = useState({
    name: "Will",
    id: "bIHbv24MWmeRgasZH58o",
    icon: "W",
    color: "bg-orange-500",
  })
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const voiceOptions = [
    { name: "Brian", id: "nPczCjzI2devNBz1zQrb", icon: "B", color: "bg-blue-500" },
    { name: "Will", id: "bIHbv24MWmeRgasZH58o", icon: "W", color: "bg-orange-500" },
    { name: "Lily", id: "pFZP5JQG7iQjIQuC4Bku", icon: "L", color: "bg-purple-500" },
    { name: "George", id: "JBFqnCBsd6RMkjVDRZzb", icon: "G", color: "bg-teal-500" },
  ]

  const conversation = useConversation({
    mode: "webrtc",
    onConnect: () => {
      console.log("Connected to conversation")
      setError(null)
    },
    onDisconnect: () => {
      console.log("Disconnected from conversation")
      setIsLoading(false)
    },
    onError: (error) => {
      console.error("Conversation error:", error)
      if (isDemoMode) {
        setError("Demo mode: This is a placeholder connection. Set up your AGENT_ID for real functionality.")
      } else {
        setError(`Conversation error: ${error.message || "Unknown error"}`)
      }
      setIsLoading(false)
    },
    onMessage: (message) => {
      console.log("Message received:", message)
    },
  })

  async function startConversation() {
    try {
      setIsLoading(true)
      setError(null)

      console.log("Requesting microphone permission...")
      const hasPermission = await requestMicrophonePermission()
      if (!hasPermission) {
        setError("Microphone permission is required for voice conversation")
        setIsLoading(false)
        return
      }

      console.log("Getting signed URL...")
      const { signedUrl, isDemo } = await getSignedUrl()

      if (isDemo) {
        setIsDemoMode(true)
        setError(
          "Demo mode: Using placeholder agent ID. Set up your AGENT_ID environment variable for real functionality.",
        )
        setIsLoading(false)
        return
      }

      console.log("Got signed URL, starting session...")
      const romanToArabic: { [key: string]: string } = {
        I: "1",
        II: "2",
        III: "3",
        IV: "4",
        V: "5",
        VI: "6",
        VII: "7",
        VIII: "8",
        IX: "9",
        X: "10",
      }

      const romanMatch = currentChapter.match(/Chapter\s+([IVXLC]+)/i)
      const arabicMatch = currentChapter.match(/\d+/)

      let chapterNumber = "1"
      if (romanMatch && romanToArabic[romanMatch[1]]) {
        chapterNumber = romanToArabic[romanMatch[1]]
      } else if (arabicMatch) {
        chapterNumber = arabicMatch[0]
      }

      await conversation.startSession({
        signedUrl,
        overrides: {
          tts: {
            voiceId: selectedVoice.id,
          },
        },
        dynamicVariables: {
          firstName: firstName,
          chapterNumber: chapterNumber,
          lineText: currentParagraph || "Beginning of the book",
        },
      })
      console.log("Session started successfully")

      setIsLoading(false)
    } catch (error) {
      console.error("Error starting conversation:", error)
      setError(error instanceof Error ? error.message : "Failed to start conversation")
      setIsLoading(false)
    }
  }

  const stopConversation = useCallback(async () => {
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
  }, [conversation])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setShowBottomSheet(false)
      setIsClosing(false)
    }, 300) // Match animation duration
  }, [])

  const handleEndConversation = useCallback(async () => {
    if (conversation.status === "connected") {
      await stopConversation()
    }
    handleClose()
  }, [conversation.status, stopConversation, handleClose])

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return

      const container = scrollContainerRef.current
      const containerTop = container.scrollTop
      const containerHeight = container.clientHeight
      const viewportCenter = containerTop + containerHeight / 2

      let activeChapter = "Chapter I"
      let activeParagraph = ""

      const chapterElements = container.querySelectorAll("[data-chapter]")
      const paragraphElements = container.querySelectorAll("[data-paragraph]")

      let currentChapterElement = null
      for (let i = chapterElements.length - 1; i >= 0; i--) {
        const element = chapterElements[i] as HTMLElement
        const rect = element.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const elementTop = rect.top - containerRect.top + containerTop

        if (elementTop <= viewportCenter) {
          currentChapterElement = element
          activeChapter = element.getAttribute("data-chapter") || "Chapter I"
          break
        }
      }

      paragraphElements.forEach((element) => {
        const rect = element.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const elementTop = rect.top - containerRect.top + containerTop
        const elementBottom = elementTop + rect.height

        if (elementTop <= viewportCenter && elementBottom > viewportCenter) {
          const paragraphText = element.textContent || ""
          if (paragraphText.length > 50) {
            activeParagraph = paragraphText.substring(0, 120) + "..."
          } else {
            activeParagraph = paragraphText
          }
        }
      })

      setCurrentChapter(activeChapter)
      if (activeParagraph) {
        setCurrentParagraph(activeParagraph)
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      handleScroll() // Initial call
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const renderContent = (content: any, chapterTitle: string) => {
    switch (content.type) {
      case "header":
        return (
          <h2
            key={`${chapterTitle}-header`}
            className="text-2xl font-semibold text-gray-800 mb-4"
            data-chapter={chapterTitle}
          >
            {content.text}
          </h2>
        )
      case "paragraph":
        return (
          <p
            key={`${chapterTitle}-${content.text.substring(0, 20)}`}
            className="mb-4 text-gray-700 leading-relaxed"
            data-paragraph="true"
          >
            {content.text}
          </p>
        )
      case "table":
        return (
          <div key={`${chapterTitle}-table`} className="mb-6 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                {content.rows.map((row: any, rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.cells.map((cell: any, cellIndex: number) => (
                      <td
                        key={cellIndex}
                        className={`border border-gray-300 px-3 py-2 text-sm ${cell.className || ""}`}
                      >
                        {cell.text}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen relative">
      <div className="absolute left-6 top-6 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Knowledge</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </Label>
            <Input
              id="name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <Label htmlFor="voice" className="text-sm font-medium text-gray-700">
              Voice
            </Label>
            <Select
              value={selectedVoice.name}
              onValueChange={(voiceName) => {
                const voice = voiceOptions.find((v) => v.name === voiceName)
                if (voice) {
                  setSelectedVoice(voice)
                }
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {voiceOptions.map((voice) => (
                  <SelectItem key={voice.id} value={voice.name} className="bg-white hover:bg-gray-50 cursor-pointer">
                    {voice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="chapter" className="text-sm font-medium text-gray-700">
              Chapter
            </Label>
            <Input id="chapter" value={currentChapter} className="mt-1 bg-gray-50" readOnly />
          </div>

          <div>
            <Label htmlFor="line" className="text-sm font-medium text-gray-700">
              Line
            </Label>
            <Textarea
              id="line"
              value={currentParagraph || "Scroll to see the current paragraph..."}
              className="mt-1 bg-gray-50 resize-none"
              rows={4}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="w-[375px] h-[812px] bg-black rounded-[3rem] p-2 shadow-2xl mt-6">
        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 bg-white z-10">
            <div className="flex justify-between items-center px-6 pt-3 pb-2">
              <span className="text-lg font-semibold text-black">11:11</span>

              {/* Dynamic Island / Notch */}
              <div className="w-32 h-6 bg-black rounded-full"></div>

              {/* Status icons */}
              <div className="flex items-center gap-1">
                {/* Signal bars */}
                <div className="flex items-end gap-0.5">
                  <div className="w-1 h-1 bg-black rounded-full"></div>
                  <div className="w-1 h-2 bg-black rounded-full"></div>
                  <div className="w-1 h-3 bg-black rounded-full"></div>
                  <div className="w-1 h-4 bg-black rounded-full"></div>
                </div>

                {/* WiFi icon */}
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                </svg>

                {/* Battery icon */}
                <div className="w-6 h-3 border border-black rounded-sm relative ml-1">
                  <div className="absolute right-0 top-0 w-5 h-full bg-black rounded-sm" style={{ left: "-2px" }}></div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center px-6 pt-0 pb-0.5 border-b border-gray-100">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="overflow-y-auto px-6 pb-32"
            style={{ height: "calc(100% - 200px)", paddingTop: "120px" }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{gatsbyContent.title}</h1>
              <p className="text-gray-600 text-lg">{gatsbyContent.author}</p>
            </div>

            <div className="space-y-8">
              {gatsbyContent.chapters.map((chapter) => (
                <div key={chapter.id} className="space-y-4">
                  {chapter.content.map((content, index) => renderContent(content, chapter.title))}
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <span>02:21</span>
              <span>-01:12</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
              <div className="bg-blue-500 h-1 rounded-full" style={{ width: "35%" }}></div>
            </div>

            <div className="flex items-center justify-center gap-8 mb-4">
              <Button variant="ghost" size="icon">
                <SkipBack className="h-6 w-6" />
              </Button>

              <Button
                size="icon"
                className="w-14 h-14 rounded-full bg-gray-900 hover:bg-gray-800"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white ml-1" />}
              </Button>

              <Button variant="ghost" size="icon">
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Avatar className={`w-8 h-8 ${selectedVoice.color}`}>
                <AvatarFallback className={`${selectedVoice.color} text-white font-semibold`}>
                  {selectedVoice.icon}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{selectedVoice.name}</span>
              <Button variant="ghost" size="icon" onClick={() => setShowBottomSheet(true)} className="[&_svg]:size-7">
                <svg width="56" height="55" viewBox="0 0 56 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M28 48.25C39.1838 48.25 48.25 39.1838 48.25 28C48.25 16.8162 39.1838 7.75 28 7.75C16.8162 7.75 7.75 16.8162 7.75 28C7.75 31.3472 8.56209 34.5047 10 37.2862L7.75 48.25L19 46.1451C21.7112 47.4924 24.7671 48.25 28 48.25Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M27 47.25C38.1838 47.25 47.25 38.1838 47.25 27C47.25 15.8162 38.1838 6.75 27 6.75C15.8162 6.75 6.75 15.8162 6.75 27C6.75 30.3472 7.56209 33.5047 9 36.2862L6.75 47.25L18 45.1451C20.7112 46.4924 23.7671 47.25 27 47.25Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M29 47.25C40.1838 47.25 49.25 38.1838 49.25 27C49.25 15.8162 40.1838 6.75 29 6.75C17.8162 6.75 8.75 15.8162 8.75 27C8.75 30.3472 9.56209 33.5047 11 36.2862L8.75 47.25L20 45.1451C22.7112 46.4924 25.7671 47.25 29 47.25Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M38.2726 17.7384C37.795 17.2521 37.491 16.5387 37.3745 15.5413V15.125H36.5005V15.5409C36.38 16.555 36.0759 17.2524 35.6017 17.7267C35.1274 18.2009 34.43 18.505 33.4159 18.6255H33V19.4995H33.4163C34.4137 19.616 35.1271 19.92 35.6134 20.3976C36.0979 20.8733 36.408 21.5714 36.5005 22.5783V23H37.3745V22.5778C37.4633 21.5875 37.7731 20.8736 38.2609 20.3859C38.7486 19.8981 39.4625 19.5883 40.4528 19.4995H40.875V18.6255H40.4533C39.4464 18.533 38.7483 18.2229 38.2726 17.7384Z"
                    fill="black"
                  />
                  <path
                    d="M17.25 29.75C20.6283 29.75 22.804 30.4965 24.1537 31.8463C25.5035 33.196 26.25 35.3717 26.25 38.75H28.5C28.5 35.3717 29.2465 33.196 30.5963 31.8463C31.946 30.4965 34.1217 29.75 37.5 29.75V27.5C34.1217 27.5 31.946 26.7535 30.5963 25.4037C29.2465 24.054 28.5 21.8783 28.5 18.5H26.25C26.25 21.8783 25.5035 24.054 24.1537 25.4037C22.804 26.7535 20.6283 27.5 17.25 27.5V29.75Z"
                    fill="black"
                  />
                </svg>
              </Button>
            </div>
          </div>

          {showBottomSheet && (
            <>
              <div className="absolute inset-0 bg-black/10 z-40" onClick={handleClose} />

              <div
                className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 ${
                  isClosing
                    ? "animate-out slide-out-to-bottom duration-300"
                    : "animate-in slide-in-from-bottom duration-300"
                }`}
                style={{ height: "55%" }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-1 bg-gray-400 rounded-full"></div>
                </div>

                <div className="flex justify-end mb-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEndConversation}
                    className={`rounded-full w-8 h-8 flex items-center gap-1 ${
                      conversation.status === "connected" ? "text-red-500 hover:text-red-600" : "text-gray-600"
                    }`}
                  >
                    {conversation.status === "connected" ? (
                      <>
                        <Phone className="h-4 w-4 rotate-[135deg]" />
                        <span className="text-xs font-medium">End</span>
                      </>
                    ) : (
                      <X className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                <div className="flex flex-col items-center mb-4">
                  <div className="relative w-48 h-48 mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-radial from-cyan-200 via-blue-400 to-blue-600 shadow-2xl"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-conic from-transparent via-white/30 to-transparent opacity-60"></div>
                    <div className="absolute inset-4 rounded-full bg-gradient-radial from-white/20 via-transparent to-transparent"></div>
                    <div className="absolute inset-8 rounded-full bg-gradient-radial from-transparent via-blue-300/40 to-blue-600/60"></div>
                    {conversation.status === "connected" && !conversation.isSpeaking && (
                      <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-pulse"></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isDemoMode ? (
                        <span
                          className="text-gray-800 font-semibold bg-white/95 rounded-full backdrop-blur-sm shadow-lg"
                          style={{
                            fontSize: "0.9rem",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                            paddingTop: "0.75rem",
                            paddingBottom: "0.75rem",
                          }}
                        >
                          Demo Mode
                        </span>
                      ) : conversation.status === "connected" ? (
                        <span
                          className="text-gray-800 font-semibold bg-white/95 rounded-full backdrop-blur-sm shadow-lg"
                          style={{
                            fontSize: "0.9rem",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                            paddingTop: "0.75rem",
                            paddingBottom: "0.75rem",
                          }}
                        >
                          {conversation.isSpeaking ? "Talk to interrupt" : "Listening"}
                        </span>
                      ) : isLoading ? (
                        <span
                          className="text-gray-800 font-semibold bg-white/95 rounded-full backdrop-blur-sm shadow-lg"
                          style={{
                            fontSize: "0.9rem",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                            paddingTop: "0.75rem",
                            paddingBottom: "0.75rem",
                          }}
                        >
                          Starting...
                        </span>
                      ) : (
                        <Button
                          onClick={startConversation}
                          className="bg-white/95 hover:bg-white text-gray-800 font-semibold rounded-full backdrop-blur-sm border-0 shadow-lg"
                          style={{
                            fontSize: "0.9rem",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                            paddingTop: "0.75rem",
                            paddingBottom: "0.75rem",
                          }}
                          disabled={isLoading}
                        >
                          Ask
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Ask about The Great Gatsby</h3>

                <p className="text-center text-gray-500 text-sm" style={{ padding: "0px" }}>
                  Try asking about a passage, historical context, character insights, or anything else.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
