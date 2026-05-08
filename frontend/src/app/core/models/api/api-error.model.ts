export interface ApiError {
  timestamp: string;
  status: number;
  error?: string;
  messageCode?: string;
  fields?: Record<string, string>;
}
