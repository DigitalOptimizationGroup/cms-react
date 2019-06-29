import { featureProvider } from "./featureProvider";
import { Track } from "./Track";

function ConnectFeature({
  variation,
  tracking,
  queryName,
  args,
  isLoading,
  error,
  children
}) {
  if (typeof children !== "function") {
    throw new Error(
      `The child of <Feature queryName="${queryName}"${
        args ? " args={...}" : ""
      }> is not a Function. You need to provide a render prop such as <Feature queryName="${queryName}"${
        args ? " args={...}" : ""
      }>{(props)=><div/>}</Feature>. Learn more: https://www.npmjs.com/package/@digitaloptgroup/cms-react`
    );
  }

  if (isLoading || error) {
    return children({ isLoading, variation, tracking, error });
  } else {
    return children({
      variation,
      tracking,
      isLoading,
      error
    });
  }
}

const Feature = featureProvider(ConnectFeature);

Feature.Track = Track;

export { Feature };
