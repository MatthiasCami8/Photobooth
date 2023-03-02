import "animate.css";

import CheckIcon from "@mui/icons-material/Check";
import SouthIcon from "@mui/icons-material/South";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { logEvent } from "firebase/analytics";
import React from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { analytics } from "../../utils/firebase";
import BottomAppBar from "../layout/BottomAppBar";
import HorizontalStepper from "../layout/HorizontalStepper";
import ArtSelector from "../media/ArtSelector";

const SelectArtPage = () => {
  let navigate = useNavigate();

  const { t } = useTranslation();

  const [chosenImage, setChosenImage] = React.useState(null);

  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);
  const breakpoint = 750;

  React.useEffect(() => {
    /* Inside of a "useEffect" hook add an event listener that updates
       the "width" state variable when the window size changes */
    window.addEventListener("resize", () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    });

    /* passing an empty array as the dependencies of the effect will cause this
       effect to only run when the component mounts, and not each time it updates.
       We only want the listener to be added once */
  }, []);

  const renderText = () => {
    if (chosenImage) {
      return (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" align="center" sx={{ mt: 2 }}>
            {t("YouChoseImage").replace("@name", chosenImage.title)}
          </Typography>
          {height > breakpoint ? (
            <React.Fragment>
              <Typography variant="h5" align="center" sx={{ mt: 2 }}>
                {t("PressButtonBelow")}
              </Typography>
              <Typography
                className="animate__animated animate__pulse animate__infinite animate_fast"
                variant="h2"
                align="center"
                style={{ color: "#ff913a" }}
              >
                <SouthIcon fontSize="inherit" />
              </Typography>
            </React.Fragment>
          ) : null}
        </Box>
      );
    } else {
      return (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" align="center" sx={{ mt: 2 }}>
            {t("NoChosenImage")}
          </Typography>
          <Typography
            className="animate__animated animate__pulse animate__infinite animate_fast"
            variant="h2"
            align="center"
            style={{ color: "#ff913a" }}
          >
            <TouchAppIcon fontSize="inherit" />
          </Typography>
        </Box>
      );
    }
  };
  return (
    <React.Fragment>
      <HorizontalStepper activeStep={1} />
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <ArtSelector
          onChoseImage={(item) => {
            logEvent(analytics, "selected_image", { image: item });
            setChosenImage(item);
          }}
        />
        {renderText()}
      </Box>

      <BottomAppBar
        onBack={() => navigate("../capture")}
        firstFabIcon={chosenImage ? <CheckIcon /> : null}
        caption={chosenImage ? t("Continue") : t("SelectPaintingStepper")}
        onClickFirstFab={() => {
          logEvent(analytics, "chosen_image", { image: chosenImage });
          localStorage.setItem("portrait_url", chosenImage.img);
          navigate(`../deepfake/?href=${chosenImage.path}`);
        }}
      />
    </React.Fragment>
  );
};
export default withTranslation()(SelectArtPage);
