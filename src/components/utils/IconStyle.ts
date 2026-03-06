// IconStyles.ts
import styled from "@emotion/styled";
import { LuLogIn } from "react-icons/lu";
import { IoPerson } from "react-icons/io5";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaMagnifyingGlassMinus } from "react-icons/fa6";
import { TiThMenu } from "react-icons/ti";
import { IoClose } from "react-icons/io5"; // 메뉴가 열린 상태에서 취소(닫기) 아이콘 예시
import { MdMovie } from "react-icons/md";
import { FaWallet } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";
import { AiFillHeart } from "react-icons/ai";
import { HiTicket } from "react-icons/hi2";
import { FaUserPlus } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { BiSolidEdit } from "react-icons/bi";

// 공통 아이콘 스타일 (기본 크기와 색상, 호버 효과 등)
const iconBaseStyles = `
  font-size: 24px;
  color: white;
  transition: color 0.3s ease;
  cursor: pointer;
  &:hover {
    color: orange;
  }
`;

// 로그인 모달에 사용할 스타일
const logInBaseStyles = `
  font-size: 15px;
  color: #1677ff;
  transition: color 0.3s ease;
  cursor: pointer;
  position: relative;
  top: 1.5px;
  &:hover {
     color: #69b1ff;
  }
`;

export const LogInIcon = styled(LuLogIn)`
  ${logInBaseStyles}
`;

export const EditBoxLine = styled(BiSolidEdit)`
  ${iconBaseStyles}
`;

export const MenuIcon = styled(TiThMenu)`
  ${iconBaseStyles}
`;

export const CloseIcon = styled(IoClose)`
  ${iconBaseStyles}
`;

export const SearchIcon = styled(FaMagnifyingGlass)`
  ${iconBaseStyles}
`;

export const SearchMinusIcon = styled(FaMagnifyingGlassMinus)`
  ${iconBaseStyles}
`;

export const PersonIcon = styled(IoPerson)`
  ${iconBaseStyles}
`;

// 최신영화
export const RatedMovies = styled(MdMovie)`
  ${iconBaseStyles}
`;
// 티켓예매
export const BookingMovies = styled(FaWallet)`
  ${iconBaseStyles}
`;

// 비회원 예매확인
export const GuestMovies = styled(HiTicket)`
  ${iconBaseStyles}
`;

// 최신방송
export const RatedTv = styled(MdLiveTv)`
  ${iconBaseStyles}
`;
// 즐겨찾기 목록
export const FavoriteLists = styled(AiFillHeart)`
  ${iconBaseStyles}
`;
// 즐겨찾기 방송 북마크
// export const FavoriteTv = styled(AiOutlineLike)`
//   ${iconBaseStyles}
// `;
// 회원 가입
export const Signup = styled(FaUserPlus)`
  ${iconBaseStyles}
`;
// 프로필수정
export const Editprofile = styled(FaUserEdit)`
  ${iconBaseStyles}
`;
