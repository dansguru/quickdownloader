import { DeviceInfo } from '@/types/device';

export function detectDeviceInfo(): DeviceInfo {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Detect OS
  const isAndroid = /android/.test(userAgent);
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isWindows = /windows/.test(userAgent);
  const isMac = /macintosh/.test(userAgent);
  const isLinux = /linux/.test(userAgent);
  
  // Detect architecture
  const is64Bit = /x64|arm64|aarch64/.test(userAgent);
  const isARM = /arm/.test(userAgent);
  const isX86 = /x86|intel/.test(userAgent);
  
  // Detect screen density
  const pixelRatio = window.devicePixelRatio || 1;
  let density = 'mdpi';
  if (pixelRatio >= 4) density = 'xxxhdpi';
  else if (pixelRatio >= 3) density = 'xxhdpi';
  else if (pixelRatio >= 2) density = 'xhdpi';
  else if (pixelRatio >= 1.5) density = 'hdpi';
  else if (pixelRatio >= 1.33) density = 'tvdpi';
  else if (pixelRatio >= 1) density = 'mdpi';
  else density = 'ldpi';
  
  // Detect language
  const language = navigator.language.split('-')[0];
  
  // Determine architecture string
  let architecture = '';
  if (isARM) {
    architecture = is64Bit ? 'arm64_v8a' : 'armeabi_v7a';
  } else if (isX86) {
    architecture = is64Bit ? 'x86_64' : 'x86';
  }
  
  return {
    os: isAndroid ? 'android' : isIOS ? 'ios' : isWindows ? 'windows' : isMac ? 'mac' : isLinux ? 'linux' : 'unknown',
    architecture,
    density,
    language,
    is64Bit,
    userAgent: navigator.userAgent
  };
}

export function getDeviceSpecificApk(deviceInfo: DeviceInfo): string {
  const { architecture, density, language } = deviceInfo;
  
  // If we have a specific architecture APK, use it
  if (architecture) {
    return `base-${architecture}.apk`;
  }
  
  // If we have a specific density APK, use it
  if (density) {
    return `base-${density}.apk`;
  }
  
  // If we have a specific language APK, use it
  if (language) {
    return `base-${language}.apk`;
  }
  
  // Fallback to universal APK
  return 'universal.apk';
}
