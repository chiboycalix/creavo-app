import AgoraRTC, {
  ILocalAudioTrack,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";

export interface Options {
  appid?: string | undefined;
  channel?: string;
  rtcToken?: string | null;
  rtmToken?: string | null;
  uid?: any;
  audienceLatency: number;
  role: string;
  proxyMode?: string;
  certificate?: string;
}

export type ILocalTrack = {
  audioTrack: (ILocalAudioTrack & IMicrophoneAudioTrack) | null;
  videoTrack: (ICameraVideoTrack & ILocalVideoTrack) | null;
  screenTrack: {
    screenAudioTrack: ILocalAudioTrack | null;
    screenVideoTrack: ILocalVideoTrack;
  } | null;
};

export interface CommentPayload {
  comment: string;
  postId: number;
  commentId?: number;
}

export enum KEYS {
  REDUX_STORE = "cVYHWVYQhuKE2Rg8FIkm6w==",
}
export interface CreateModuleForm {
  moduleTitle: string;
}
