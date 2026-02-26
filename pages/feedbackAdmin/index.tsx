import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import FeedbackAdContainer from "../../src/containers/feedbackAdmin/FeedbackAdContainer";
import { useEffect } from "react";

export default function index() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading") {
      if (!session || session?.user?.role !== "admin") {
        router.push("/");
      }
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;

  if (!session || session?.user?.role !== "admin") {
    return null;
  }

  return <FeedbackAdContainer />;
}
