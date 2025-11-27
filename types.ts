
export type QuestionType = 'single' | 'multi';

export interface Option {
  id: string;
  text: string;
  styleCategory?: string; // For calculating the management style (e.g., 'Result', 'Team')
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: Option[];
}

export interface VoteRecord {
  id: string;
  userName: string;
  answers: Record<string, string[]>; // questionId -> array of optionIds
  calculatedStyle: string; // The dominant style calculated from answers
  timestamp: number;
}

export interface AggregatedStats {
  totalParticipants: number;
  styleDistribution: Record<string, number>; // Count of each style
  questionStats: Record<string, Record<string, number>>; // questionId -> optionId -> count
}

export enum AppMode {
  LANDING = 'LANDING',
  PARTICIPANT = 'PARTICIPANT',
  PRESENTER = 'PRESENTER'
}
