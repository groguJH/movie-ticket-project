export interface NonMemberEntity {
  _id?: string; // MongoDB ObjectId가 문자열로 들어옴
  name: string;
  birth: string; // YYMMDD
  phone: string; // 숫자만
  password: string; // 숫자4자리
  movieId: string;
  createdAt?: Date;
}

export interface NonMemberBookingFormValues {
  name: string;
  birth: string;
  phone: string;
  password: string;
}

export interface NonMemberSearchResponse {
  name: string;
  birth: string;
  phone: string;
  password: string;
  createdAt?: Date;
  movieId?: string | null;
}
