"use client"

import { useEffect, useState } from "react"
import { Download, Info, Smartphone, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useMobile } from "@/hooks/use-mobile"
import { detectDeviceInfo } from "@/lib/device-detection"
import { selectApk, getApkSize, getReadableApkName } from "@/lib/apk-selector"
import { ShareButton } from "@/components/share-button"
import { DownloadHandler } from "@/components/download-handler"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import { ApkSelector } from '@/components/apk-selector'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Home() {
  const isMobile = useMobile()
  const [deviceInfo, setDeviceInfo] = useState<any>(null)
  const [selectedApk, setSelectedApk] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const info = detectDeviceInfo()
      setDeviceInfo(info)
      const apk = selectApk(info)
      setSelectedApk(apk)
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            APK Downloader
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Download the perfect APK version for your device
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <ApkSelector />
          
          {selectedApk && (
            <Card>
              <CardHeader>
                <CardTitle>Download Options</CardTitle>
                <CardDescription>
                  Choose how you want to download the APK
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DownloadHandler apkName={selectedApk} />
                
                <div className="flex justify-center">
                  <ShareButton 
                    title="Download our app"
                    text={`Download the perfect APK version for your device. I'm using ${getReadableApkName(selectedApk)}`}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {!isMobile && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Desktop Browser Detected</AlertTitle>
              <AlertDescription>
                This app is designed for mobile devices. For the best experience, please visit this page on your Android device.
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>We automatically detect your device specifications to provide the best APK version</p>
            <p className="mt-2">If you encounter any issues, please try the universal APK version</p>
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  )
}
