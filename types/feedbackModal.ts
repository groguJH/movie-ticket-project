/**
 * 피드백 모달 관련 타입 정의 파일
 * @Entity 피드백 데이터베이스 엔티티 정의, 중요한 데이터는 아니라고 생각해서 요청DTO와 동일하게 작성했습니다. responseDTO는 분리합니다.
 * @Response 피드백 응답 DTO 정의
 * @Request 피드백 요청 DTO 정의
 * @UpdateFeedbackRequest 피드백 수정 요청 DTO 정의
 * @description
 *  - 이 파일은 피드백 모달과 관련된 타입들을 정의합니다.
 *  - 피드백 작성, 조회, 수정 등에 사용되는 데이터 구조를 명확히 합니다.
 */

import { ObjectId } from "mongodb";

export interface FeedbackEntity {
  _id: string | ObjectId;
  title: string;
  content: string;
  userId: string;
  userName: string;
  role: string;
  satisfaction: string;
  createdAt: Date | string;

  // 관리자 필드
  status?: "before reply" | "resolved" | "in_progress";
  handledBy?: string; // 담당한 관리자 Name
  isPublic?: boolean; // 공개해도 되는 내용인지 여부
  isFlagged?: boolean; // 내용의 중요도 여부
  replied?: boolean; // 답변여부
  response?: FeedbackAdResponse[];
}

export interface FeedbackResponse {
  title: string;
  content: string;
  userName: string;
  satisfaction?: string;
  createdAt: string;
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
  id: string;
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

// 피드백 수정 요청 DTO
export interface UpdateFeedbackRequest {
  title?: string;
  content?: string;
  satisfaction?: string;
}
