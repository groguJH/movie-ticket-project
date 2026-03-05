import styled from "@emotion/styled";
import { LuLogIn } from "react-icons/lu";
import { IoPerson } from "react-icons/io5";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaMagnifyingGlassMinus } from "react-icons/fa6";
import { TiThMenu } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { MdMovie } from "react-icons/md";
import { FaWallet } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";
import { AiFillHeart } from "react-icons/ai";
import { HiTicket } from "react-icons/hi2";
import { FaUserPlus } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { BiSolidEdit } from "react-icons/bi";

const iconBaseStyles = `
  font-size: 24px;
  color: white;
  transition: color 0.3s ease;
  cursor: pointer;
  &:hover {
    color: orange;
  }
`;

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

export const RatedMovies = styled(MdMovie)`
  ${iconBaseStyles}
`;
export const BookingMovies = styled(FaWallet)`
  ${iconBaseStyles}
`;

export const GuestMovies = styled(HiTicket)`
  ${iconBaseStyles}
`;

export const RatedTv = styled(MdLiveTv)`
  ${iconBaseStyles}
`;
export const FavoriteLists = styled(AiFillHeart)`
  ${iconBaseStyles}
`;
export const Signup = styled(FaUserPlus)`
  ${iconBaseStyles}
`;
export const Editprofile = styled(FaUserEdit)`
  ${iconBaseStyles}
`;
