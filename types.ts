
export interface MeetingPoster {
  meeting_id: string;
  content: string;
}

export interface AnalysisResult {
  markdownText: string;
  revisedImageUrl?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
