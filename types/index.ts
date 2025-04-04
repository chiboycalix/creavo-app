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
  courseId: any;
  title: string;
  description: string;
  difficultyLevel?: string;
  media?: Array<{
    url: string;
    title: string;
    description: string;
    mimeType: string;
  }>;
}

export interface CreateModuleForm {
  title: string;
  description: string;
  difficultyLevel?: string;
}

export interface AddMediaToModule {
  courseId: any;
  moduleId: any;
  media?: Array<{
    url: string;
    title: string;
    description: string;
    mimeType: string;
    mediaLength: number;
  }>;
}

export type QuestionType = {
  type: "trueFalse" | "multipleChoice";
  questionNumber: number;
};

export type QuestionData = {
  questionText: string;
  optionValues: string[];
  selectedOption: number | null;
  correctAnswer: "true" | "false" | "";
  allocatedPoint: number;
  questionId: string;
};

export type QuizData = {
  moduleId: number | null;
  title: string;
  description: string;
  allocatedTime: number;
  totalPoint: number;
  questions: any[];
};

export interface CreateCommunityForm {
  name: string;
  description: string;
  logo?: string;
}

export interface CreateSpaceForm {
  name: string;
  description: string;
  logo?: string;
}
