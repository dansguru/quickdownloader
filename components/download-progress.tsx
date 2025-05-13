"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface DownloadProgressProps {
  fileName: string
  fileSize: number
  onComplete: () => void
  onError: () => void
  isDownloading: boolean
}

export function DownloadProgress({ fileName, fileSize, onComplete, onError, isDownloading }: DownloadProgressProps) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "downloading" | "complete" | "error">("idle")
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  useEffect(() => {
    if (isDownloading && status !== "downloading") {
      setStatus("downloading")
      setProgress(0)

      // Simulate download progress
      // In a real app, you would use fetch with a ReadableStream to track actual progress
      const startTime = Date.now()
      let downloaded = 0

      const interval = setInterval(() => {
        // Simulate variable download speed
        const increment = Math.random() * 5 + 2 // 2-7% increment per tick
        downloaded = Math.min(downloaded + increment, 100)
        setProgress(downloaded)

        // Calculate speed (simulated)
        const elapsedSeconds = (Date.now() - startTime) / 1000
        if (elapsedSeconds > 0) {
          const downloadedBytes = (downloaded / 100) * fileSize
          const speedBps = downloadedBytes / elapsedSeconds
          setDownloadSpeed(speedBps)

          // Calculate time remaining
          if (downloaded < 100) {
            const remainingBytes = fileSize - downloadedBytes
            const remainingSeconds = remainingBytes / speedBps
            setTimeRemaining(remainingSeconds)
          } else {
            setTimeRemaining(0)
          }
        }

        if (downloaded >= 100) {
          clearInterval(interval)
          setStatus("complete")
          onComplete()
        }
      }, 200)

      // Simulate potential errors (10% chance)
      if (Math.random() < 0.1 && false) {
        // Disabled for demo
        clearInterval(interval)
        setStatus("error")
        onError()
      }

      return () => clearInterval(interval)
    }
  }, [isDownloading, fileSize, onComplete, onError, status])

  const formatSpeed = (bps: number) => {
    if (bps >= 1048576) {
      return `${(bps / 1048576).toFixed(1)} MB/s`
    } else if (bps >= 1024) {
      return `${(bps / 1024).toFixed(1)} KB/s`
    } else {
      return `${Math.round(bps)} B/s`
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`
    } else {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.round(seconds % 60)
      return `${minutes}m ${remainingSeconds}s`
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) {
      return `${(bytes / 1048576).toFixed(1)} MB`
    } else if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    } else {
      return `${bytes} bytes`
    }
  }

  if (status === "idle") {
    return null
  }

  return (
    <div className="w-full space-y-2 mt-4">
      <div className="flex justify-between items-center text-sm">
        <div className="font-medium truncate max-w-[200px]">{fileName}</div>
        <div className="text-muted-foreground">{formatFileSize(fileSize)}</div>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="flex justify-between items-center text-xs">
        {status === "downloading" && (
          <>
            <div className="text-muted-foreground">{downloadSpeed !== null && `${formatSpeed(downloadSpeed)}`}</div>
            <div className="text-muted-foreground">
              {timeRemaining !== null && timeRemaining > 0 && `${formatTime(timeRemaining)} remaining`}
              {timeRemaining !== null && timeRemaining === 0 && "Completing..."}
            </div>
          </>
        )}

        {status === "complete" && (
          <div className="flex items-center text-green-600 w-full justify-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>Download complete</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center text-red-600 w-full justify-center gap-1">
            <AlertCircle className="h-4 w-4" />
            <span>Download failed. Please try again.</span>
          </div>
        )}
      </div>
    </div>
  )
}
