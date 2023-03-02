import { Box, Typography } from "@mui/material";
import { setUserId } from "firebase/analytics";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import StoryImage from "../../assets/site/photobooth_faceswap_example.jpg";
import { analytics } from "../../utils/firebase";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SouthIcon from "@mui/icons-material/South";
import BottomAppBar from "../layout/BottomAppBar";
import HorizontalStepper from "../layout/HorizontalStepper";
const StartPage = () => {
  let navigate = useNavigate();

  const { t } = useTranslation();
  React.useEffect(() => {
    setUserId(analytics, uuidv4());
  }, []);

  return (
    <React.Fragment>
      <HorizontalStepper activeStep={0} />
      <Box
        container
        display="flex"
        direction="column"
        justifyContent="center"
        sx={{
          height: "100%",
          paddingBottom: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" align="center">
          {t("WelcomeMessagePainting")}
        </Typography>
        <img
          src={StoryImage}
          alt="you"
          style={{
            height: "50%",
            maxHeight: "400px",
            width: "100%",
            objectFit: "scale-down",
          }}
        />
        <Typography variant="h2" align="center" style={{ color: "#ff913a" }}>
          <CameraAltIcon fontSize="inherit" />
        </Typography>
        <Typography variant="h5" align="center">
          {t("GettingStarted")}
        </Typography>
        <Typography variant="h2" align="center" style={{ color: "#ff913a" }}>
          <SouthIcon fontSize="inherit" />
        </Typography>
      </Box>
      <BottomAppBar
        firstFabIcon={<PlayArrowIcon />}
        onClickFirstFab={() => navigate("../capture")}
        caption={t("TakePicture")}
      />
    </React.Fragment>
  );
};

export default StartPage;
