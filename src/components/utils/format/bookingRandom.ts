/**
 * 예매번호 랜덤 함수 (12자리 숫자)
 * @return 12자리 랜덤 숫자 문자열
 */
export const DigitRandom12Number = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};
