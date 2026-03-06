import dayjs from "dayjs";

export function formatData(dataString: string): string {
  return dayjs(dataString).format("YYYY년 MM월 DD일  HH시mm분");
}
