export interface NonMemberEntity {
  _id?: string;
  name: string;
  birth: string;
  phone: string;
  password: string;
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
