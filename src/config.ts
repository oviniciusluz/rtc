import type * as mediasoup from 'mediasoup';

export const workerSettings = {
  logLevel: 'warn',
  logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp', 'rtx', 'bwe', 'score', 'simulcast', 'svc', 'sctp', 'message'],
} as mediasoup.types.WorkerSettings;

export const routerSettings = {
  mediaCodecs: [
    {
      kind: 'audio',
      mimeType: 'audio/opus',
      clockRate: 48000,
      channels: 2,
      parameters: {
        useinbandfec: 1,
      },
      rtcpFeedback: [
        { type: 'nack'},
        { type: 'nack', parameter: 'pli'},
        { type: 'ccm', parameter: 'fir'},
        { type: 'goog-remb'},
      ]
    },
    {
      kind: 'video',
      mimeType: 'video/VP8',
      clockRate: 90000,
      rtcpFeedback: [
        { type: 'nack'},
        { type: 'nack', parameter: 'pli'},
        { type: 'ccm', parameter: 'fir'},
        { type: 'goog-remb'},
      ]
    },
    {
      kind: 'video',
      mimeType: 'video/H264',
      clockRate: 90000,
      parameters: {
        'packetization-mode': 1,
        'profile-level-id': '42e01f',
        'level-asymmetry-allowed': 1
      },
      rtcpFeedback: [
        { type: 'nack'},
        { type: 'nack', parameter: 'pli'},
        { type: 'ccm', parameter: 'fir'},
        { type: 'goog-remb'},
      ]
    }
  ]
} as mediasoup.types.RouterOptions;

export const transportSettings = {
  listenIps: [
    {
      ip: '0.0.0.0',
      announcedIp: process.env.PUBLIC_IP || '0.0.0.0',
    },
  ],

  enableUdp: true,
  enableTcp: true,
  preferUdp: true,

  enableSctp: true,
  numSctpStreams: {
    OS: 1024,
    MIS: 1024,
  },

  initialAvailableOutgoingBitrate: 1000000,
} as mediasoup.types.WebRtcTransportOptions;

export function createTransportConfig(worker: mediasoup.types.Worker): mediasoup.types.WebRtcTransportOptions {
  return {
    ...transportSettings,
    appData: { worker: worker.pid }
  }
};
