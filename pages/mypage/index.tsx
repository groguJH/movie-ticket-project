import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import withAuth from "../../src/components/hoc/withAuth";
import MyPageContainer from "../../src/containers/myPage/MyPageContainer";

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/authPage/signup",
        permanent: false,
      },
    };
  }

  const name = session.user?.name ?? null;

  return {
    props: {
      name,
    },
  };
}

function MyPagePage({ name }: { name: string | null }) {
  return <MyPageContainer name={name} />;
}

export default withAuth(MyPagePage);
