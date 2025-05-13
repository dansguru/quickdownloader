import { DeviceInfo } from '@/types/device';

type ArchitectureType = 'arm64_v8a' | 'armeabi_v7a' | 'x86' | 'x86_64';
type DensityType = 'ldpi' | 'mdpi' | 'hdpi' | 'xhdpi' | 'xxhdpi' | 'xxxhdpi' | 'tvdpi';

// Map of supported architectures
const SUPPORTED_ARCHITECTURES: Record<ArchitectureType, string> = {
  'arm64_v8a': 'ARM64 (64-bit)',
  'armeabi_v7a': 'ARM (32-bit)',
  'x86': 'Intel x86 (32-bit)',
  'x86_64': 'Intel x86 (64-bit)'
};

// Map of supported densities
const SUPPORTED_DENSITIES: Record<DensityType, string> = {
  'ldpi': 'Low Density',
  'mdpi': 'Medium Density',
  'hdpi': 'High Density',
  'xhdpi': 'Extra High Density',
  'xxhdpi': 'Extra Extra High Density',
  'xxxhdpi': 'Extra Extra Extra High Density',
  'tvdpi': 'TV Density'
};

// Map of supported languages
const SUPPORTED_LANGUAGES: Record<string, string> = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'zh': 'Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  // Add more languages as needed
};

export function getReadableApkName(apkName: string): string {
  if (apkName === 'universal.apk') {
    return 'Universal APK';
  }

  const type = apkName.replace('base-', '').replace('.apk', '') as ArchitectureType | DensityType;
  
  if (type in SUPPORTED_ARCHITECTURES) {
    return SUPPORTED_ARCHITECTURES[type as ArchitectureType];
  }
  
  if (type in SUPPORTED_DENSITIES) {
    return SUPPORTED_DENSITIES[type as DensityType];
  }
  
  if (type in SUPPORTED_LANGUAGES) {
    return `${SUPPORTED_LANGUAGES[type]} Version`;
  }
  
  return type.toUpperCase();
}

export function getApkSize(apkName: string): number {
  // This would typically be fetched from the server
  // For now, we'll use a mapping of known sizes
  const sizes: Record<string, number> = {
    'universal.apk': 52451179,
    'base-arm64_v8a.apk': 4080322,
    'base-armeabi_v7a.apk': 3293900,
    'base-x86.apk': 4309668,
    'base-x86_64.apk': 4190899,
    'base-en.apk': 98650,
    // Add more as needed
  };

  return sizes[apkName] || 5000000; // Default to 5MB if unknown
}

export function selectApk(deviceInfo: DeviceInfo): string {
  // If not Android, return universal APK
  if (deviceInfo.os !== 'android') {
    return 'universal.apk';
  }

  // Try to find the best match based on architecture
  if (deviceInfo.architecture && deviceInfo.architecture in SUPPORTED_ARCHITECTURES) {
    return `base-${deviceInfo.architecture}.apk`;
  }

  // If architecture detection failed, try to match by screen density
  if (deviceInfo.density && deviceInfo.density in SUPPORTED_DENSITIES) {
    return `base-${deviceInfo.density}.apk`;
  }

  // Try to match by language
  if (deviceInfo.language && deviceInfo.language in SUPPORTED_LANGUAGES) {
    return `base-${deviceInfo.language}.apk`;
  }

  // Fallback to universal APK if no specific match
  return 'universal.apk';
}
