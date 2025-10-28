// Railway-specific configuration
export const railwayConfig = {
  isProduction: process.env.NODE_ENV === 'production',
  isRailway: process.env.RAILWAY_STATIC_URL !== undefined,
  
  // Railway automatically sets PORT
  port: process.env.PORT || 3000,
  
  // Railway provides the public URL
  publicUrl: process.env.RAILWAY_STATIC_URL,
  
  // For WebRTC, Railway has limitations
  webRtcLimitations: {
    noUdpPorts: true,
    dynamicIp: true,
    natTraversal: false
  }
};

export function getRailwayPublicIp(): string | undefined {
  if (railwayConfig.isRailway && railwayConfig.publicUrl) {
    try {
      const urlString = railwayConfig.publicUrl.startsWith('http') 
        ? railwayConfig.publicUrl 
        : `https://${railwayConfig.publicUrl}`;
      
      const url = new URL(urlString);
      return url.hostname;
    } catch (error) {
      console.warn('Failed to parse Railway URL:', railwayConfig.publicUrl);
      return undefined;
    }
  }
  return undefined;
}

export function isRailwayEnvironment(): boolean {
  return railwayConfig.isRailway;
}
