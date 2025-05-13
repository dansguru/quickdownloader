export interface DeviceInfo {
  os: 'android' | 'ios' | 'windows' | 'mac' | 'linux' | 'unknown';
  osVersion: string | null;
  manufacturer: string;
  model: string;
  architecture: string;
  density: string;
  language: string;
  region: string;
  isTablet: boolean;
  is64Bit: boolean;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  userAgent: string;
} 