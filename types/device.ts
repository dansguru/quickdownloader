export interface DeviceInfo {
  os: 'android' | 'ios' | 'windows' | 'mac' | 'linux' | 'unknown';
  architecture: string;
  density: string;
  language: string;
  is64Bit: boolean;
  userAgent: string;
} 