export interface CVIProviderProps {
  children: React.ReactNode;
}

export interface ConversationProps {
  conversationUrl: string;
  onLeave?: () => void;
  className?: string;
}

export interface ParticipantVideo {
  sessionId: string;
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;
}
