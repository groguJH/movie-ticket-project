import * as Sentry from "@sentry/nextjs";
import Error from "next/error";

const CustomErrorComponent = (props: any) => {
  return <Error statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData: any) => {
  await Sentry.captureUnderscoreErrorException(contextData);

  return Error.getInitialProps(contextData);
};

export default CustomErrorComponent;
