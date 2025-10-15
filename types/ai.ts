
export interface AIMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface AIResponse {
  response: string;
  confidence?: number;
  sources?: string[];
}
