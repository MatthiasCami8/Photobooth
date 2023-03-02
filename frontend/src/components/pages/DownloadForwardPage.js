import { getDownloadURL, ref } from "firebase/storage";
import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { storage_results } from "../../utils/firebase";
import { logEvent, setUserId } from "firebase/analytics";
import { analytics } from "../../utils/firebase";
import { v4 as uuidv4 } from "uuid";

const DownloadForwardPage = (props) => {
  const [error, setError] = React.useState(false);

  const params = useParams();
  const image_id = params.id;

  const location = useLocation();
  const parseMuseum = (location) => {
    const urlParts = location.pathname.split("/");

    const routes = ["capture", "select", "deepfake", "result"];
    if (routes.includes(urlParts[1])) {
      return "default";
    } else {
      return urlParts[1];
    }
  };
  const museum = parseMuseum(location);

  React.useEffect(() => {
    setUserId(analytics, uuidv4());
    logEvent(analytics, "visited_shared_result", { id: image_id });
    getResultImage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getResultImage = () => {
    const storageRef = ref(storage_results, `${museum}/${image_id}`);
    getDownloadURL(storageRef)
      .then((res) => {
        window.location.replace(res);
      })
      .catch((err) => {
        setError(error);
        console.log(error);
      });
  };
  return <React.Fragment />;
};

export default DownloadForwardPage;
