const config = {
  message:
    process.env.NODE_ENV === "development"
      ? "현재 개발 환경입니다."
      : "현재 배포 환경입니다.",
};

export default config;
