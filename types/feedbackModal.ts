/**
 * 피드백 타입 모음(작은 프로젝트용)
 * 파일 분리는 하지 않되, 한 파일 안에서 Entity / Request DTO / Response DTO를 구분합니다.
 */

import { ObjectId } from "mongodb";

export interface FeedbackEntity {
  _id?: string | ObjectId;
  title: string;
  content: string;
  userId: string;
  userName: string;
  role?: string;
  satisfaction: string;
  createdAt: Date | string;

  status?: "before reply" | "resolved" | "in_progress";
  handledBy?: string;
  isPublic?: boolean;
  isFlagged?: boolean;
  replied?: boolean;
  response?: FeedbackAdResponse[];
}

export type FeedbackDetail = FeedbackEntity;

export interface FeedbackResponse {
  _id?: string;
  title: string;
  content: string;
  userName: string;
  satisfaction?: string;
  createdAt: Date | string;
  response?: FeedbackAdResponse[];
}

export interface FeedbackAdResponse {
  _id?: string | ObjectId;
  text: string;
  adminName: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  isDeleted?: boolean;
}

export interface FeedbackListResponse {
  page: number;
  limit: number;
  total: number;
  feedback: FeedbackResponse[];
}

export interface FeedbackRequest {
  title: string;
  content: string;
  satisfaction?: string;
}

export interface UpdateFeedbackRequest {
  title?: string;
  content?: string;
  satisfaction?: string;
}
