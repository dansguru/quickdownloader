import { DeviceInfo } from '@/types/device';

// Common Android device patterns
const DEVICE_PATTERNS = {
  samsung: /samsung|sm-/i,
  xiaomi: /xiaomi|mi\s|redmi|poco/i,
  huawei: /huawei|honor/i,
  oneplus: /oneplus/i,
  google: /pixel|nexus/i,
  oppo: /oppo/i,
  vivo: /vivo/i,
  realme: /realme/i,
  motorola: /motorola|moto/i,
  sony: /sony/i,
  asus: /asus/i,
  nokia: /nokia/i,
  lg: /lg/i,
};

// Architecture detection patterns
const ARCHITECTURE_PATTERNS = {
  arm64_v8a: /arm64|aarch64/i,
  armeabi_v7a: /armv7|armv7l/i,
  x86_64: /x64|amd64/i,
  x86: /x86|i686/i,
};

// Screen density mapping
const DENSITY_MAP = {
  0.75: 'ldpi',
  1: 'mdpi',
  1.5: 'hdpi',
  2: 'xhdpi',
  3: 'xxhdpi',
  4: 'xxxhdpi',
  1.33: 'tvdpi',
};

export function detectDeviceInfo(): DeviceInfo {
  const userAgent = navigator.userAgent;
  const ua = userAgent.toLowerCase();
  
  // Detect OS and version
  let os: DeviceInfo['os'] = 'unknown';
  if (/android/.test(ua)) os = 'android';
  else if (/iphone|ipad|ipod/.test(ua)) os = 'ios';
  else if (/windows/.test(ua)) os = 'windows';
  else if (/macintosh/.test(ua)) os = 'mac';
  else if (/linux/.test(ua)) os = 'linux';
  
  const osVersion = os === 'android' ? ua.match(/android\s([0-9.]*)/)?.[1] || null : null;
  
  // Detect device manufacturer and model
  let manufacturer = 'unknown';
  let model = 'unknown';
  
  for (const [brand, pattern] of Object.entries(DEVICE_PATTERNS)) {
    if (pattern.test(userAgent)) {
      manufacturer = brand;
      // Try to extract model number
      const modelMatch = userAgent.match(/(?:sm-|mi\s|redmi\s|poco\s|honor\s)([a-z0-9]+)/i);
      if (modelMatch) {
        model = modelMatch[1];
      }
      break;
    }
  }
  
  // Detect architecture
  let architecture = '';
  for (const [arch, pattern] of Object.entries(ARCHITECTURE_PATTERNS)) {
    if (pattern.test(userAgent)) {
      architecture = arch;
      break;
    }
  }
  
  // Enhanced screen density detection
  const pixelRatio = window.devicePixelRatio || 1;
  let density = 'mdpi';
  
  // Find closest density
  const densities = Object.entries(DENSITY_MAP)
    .map(([ratio, name]) => ({ ratio: parseFloat(ratio), name }))
    .sort((a, b) => Math.abs(a.ratio - pixelRatio) - Math.abs(b.ratio - pixelRatio));
  
  if (densities.length > 0) {
    density = densities[0].name;
  }
  
  // Detect language and region
  const language = navigator.language.split('-')[0];
  const region = navigator.language.split('-')[1] || '';
  
  // Detect if device is tablet
  const isTablet = /tablet|ipad|android(?!.*mobile)/i.test(userAgent);
  
  // Detect if device is 64-bit
  const is64Bit = /arm64|aarch64|x64|amd64/i.test(userAgent);
  
  // Get screen dimensions
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  
  return {
    os,
    osVersion,
    manufacturer,
    model,
    architecture,
    density,
    language,
    region,
    isTablet,
    is64Bit,
    screenWidth,
    screenHeight,
    pixelRatio,
    userAgent
  };
}

export function getDeviceSpecificApk(deviceInfo: DeviceInfo): string {
  const { architecture, density, language, manufacturer, isTablet } = deviceInfo;
  
  // Priority 1: Architecture-specific APK
  if (architecture) {
    return `base-${architecture}.apk`;
  }
  
  // Priority 2: Device-specific APK (if available)
  const deviceSpecificApk = `base-${manufacturer.toLowerCase()}.apk`;
  // Note: You would need to check if this APK exists in your public/apks directory
  
  // Priority 3: Density-specific APK
  if (density) {
    return `base-${density}.apk`;
  }
  
  // Priority 4: Language-specific APK
  if (language) {
    return `base-${language}.apk`;
  }
  
  // Priority 5: Universal APK
  return 'universal.apk';
}
