import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FullPageSkeleton } from "../utils/loadingUI";

/**
 * nextAuth를 통해 로그인 설정하는 컴포넌트
 * @param WrappedComponent
 * @returns
 * @description
 * - param 은 any를 사용합니다.
 * - 인증되지 않은 사용자는 signin 페이지
 */
export default function withAuth<T>(WrappedComponent: any) {
  return (props: T) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.replace("/authPage/signup");
      }
    }, [status, router]);

    if (status === "loading") return <FullPageSkeleton />;
    if (!session) return null;

    return <WrappedComponent {...props} />;
  };
}
