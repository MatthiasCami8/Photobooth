import { Box, Typography } from "@mui/material";
import { logEvent, setUserId } from "firebase/analytics";
import { getDownloadURL, ref } from "firebase/storage";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { analytics, storage_results } from "../../utils/firebase";
import ShareAppBar from "../layout/ShareAppBar";

const SharePage = (props) => {
  const { t } = useTranslation();
  const [error, setError] = React.useState(false);

  const [resultImage, setResultImage] = React.useState(null);

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
    logEvent(analytics, "visited_share_result_page", { id: image_id });
    getResultImage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getResultImage = () => {
    const storageRef = ref(storage_results, `${museum}/${image_id}`);
    getDownloadURL(storageRef)
      .then((res) => {
        setResultImage(res);
      })
      .catch((err) => {
        setError(error);
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "#FF913A" }}
          align="center"
        >
          {t("ShareYourPictureDescription")}
        </Typography>
        <img
          src={resultImage}
          alt="result"
          style={{
            objectFit: "scale-down",
            maxHeight: "400px",
            width: "100%",
            height: "100%",
          }}
        />
      </Box>

      <ShareAppBar
        url={window.location.href.replace("share", "download")}
        caption={t("ShareYourPicture")}
      />
    </React.Fragment>
  );
};

export default SharePage;
