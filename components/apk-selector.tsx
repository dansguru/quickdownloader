import { useState, useEffect } from 'react';
import { detectDeviceInfo } from '@/lib/device-detection';
import { selectApk, getApkSize, getReadableApkName } from '@/lib/apk-selector';
import { DeviceInfo } from '@/types/device';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';

export function ApkSelector() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [selectedApk, setSelectedApk] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const info = detectDeviceInfo();
    setDeviceInfo(info);
    setSelectedApk(selectApk(info));
    setIsLoading(false);
  }, []);

  const handleDownload = async () => {
    if (!selectedApk) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      // For static export, we'll use a direct download approach
      const response = await fetch(`/apks/${selectedApk}`);
      
      if (!response.ok) {
        throw new Error('Failed to download APK');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedApk;
      
      // Set the correct MIME type
      link.type = 'application/vnd.android.package-archive';
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Download Complete',
        description: `Successfully downloaded ${getReadableApkName(selectedApk)}`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download Failed',
        description: 'There was an error downloading the APK. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Detecting Device...</CardTitle>
          <CardDescription>Please wait while we detect your device specifications</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Download APK</CardTitle>
        <CardDescription>
          We've detected your device specifications and selected the most appropriate APK version
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deviceInfo && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Operating System</p>
                <p className="text-muted-foreground">{deviceInfo.os}</p>
              </div>
              <div>
                <p className="font-medium">Architecture</p>
                <p className="text-muted-foreground">{deviceInfo.architecture || 'Unknown'}</p>
              </div>
              <div>
                <p className="font-medium">Screen Density</p>
                <p className="text-muted-foreground">{deviceInfo.density}</p>
              </div>
              <div>
                <p className="font-medium">Language</p>
                <p className="text-muted-foreground">{deviceInfo.language}</p>
              </div>
            </div>
          )}
          
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Selected Version:</span>
              <span className="font-medium">{getReadableApkName(selectedApk)}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">File Size:</span>
              <span className="font-medium">{(getApkSize(selectedApk) / (1024 * 1024)).toFixed(1)} MB</span>
            </div>

            {isDownloading && (
              <div className="space-y-2">
                <Progress value={downloadProgress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  Downloading... {downloadProgress}%
                </p>
              </div>
            )}
            
            <Button 
              onClick={handleDownload}
              className="w-full"
              disabled={!selectedApk || isDownloading}
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? 'Downloading...' : 'Download APK'}
            </Button>

            {selectedApk === 'universal.apk' && (
              <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-500">
                <AlertCircle className="h-4 w-4" />
                <span>Universal APK selected. This version may be larger than necessary for your device.</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 