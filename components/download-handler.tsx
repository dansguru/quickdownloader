import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { DownloadProgress } from '@/components/download-progress'
import { getApkSize } from '@/lib/apk-selector'

interface DownloadHandlerProps {
  apkName: string
  className?: string
}

export function DownloadHandler({ apkName, className }: DownloadHandlerProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const fileSize = getApkSize(apkName)

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      
      // Fetch the APK file
      const response = await fetch(`/apks/${apkName}`)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      // Create and trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = apkName
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      setDownloadComplete(true)
      toast({
        title: "Download started",
        description: "Your APK download has started. Check your downloads folder.",
      })
    } catch (error) {
      console.error('Download failed:', error)
      toast({
        title: "Download failed",
        description: "There was an error downloading the APK. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className={className}>
      {isDownloading ? (
        <DownloadProgress 
          fileName={apkName}
          fileSize={fileSize}
          isDownloading={isDownloading}
          onComplete={() => setDownloadComplete(true)}
          onError={() => setIsDownloading(false)}
        />
      ) : (
        <Button
          onClick={handleDownload}
          disabled={downloadComplete}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          {downloadComplete ? 'Download Complete' : 'Download APK'}
        </Button>
      )}
    </div>
  )
} 