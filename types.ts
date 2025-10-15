import React from 'react';

export enum Role {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export interface User {
  id: string;
  name: string;
  class: string;
  group: string;
  role: Role;
}

export enum StationId {
  PHYSICS = 'physics',
  ECONOMICS = 'economics',
  CHEMISTRY = 'chemistry',
}

export enum QuestionType {
  FILL_IN_BLANK = 'fill_in_blank',
  MULTIPLE_CHOICE = 'multiple_choice',
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  answer: string | string[];
  explanation: string;
}

export interface Station {
  id: StationId;
  name: string;
  description: string;
  // FIX: Using a more specific type for React components to resolve namespace errors.
  icon: React.ReactNode;
  color: string;
  accentColor: string;
  questions: Question[];
}

export interface AnswerSheet {
  [questionId: string]: string;
}

export interface GroupResult {
  groupId: string;
  stationId: StationId;
  answers: AnswerSheet;
  score: number;
  timeTaken: number;
  submittedAt: Date;
}