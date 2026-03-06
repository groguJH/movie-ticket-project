import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import FeedbackAdContainer from "../../src/containers/feedbackAdmin/FeedbackAdContainer";

export default function index() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;

  if (!session || session?.user?.role !== "admin") {
    router.push("/");
    return null;
  }

  return <FeedbackAdContainer />;
}
