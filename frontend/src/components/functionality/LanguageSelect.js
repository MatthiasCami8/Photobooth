import {
  Backdrop, Box, Fade, IconButton, Typography
} from "@mui/material";
import { setUserProperties } from "firebase/analytics";
import React from "react";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";
import { analytics } from "../utils/firebase";

const LanguageSelect = (props) => {
  const { i18n } = useTranslation();

  const changeLanguage = (language_code) => {
    i18n.changeLanguage(language_code);

    localStorage.setItem("locale", language_code);
    setUserProperties(analytics, { localization: language_code });
    // Timeout to allow button animation for interactivenes
    setTimeout(() => {
      props.onLanguageSelect();
    }, 250);
  };

  return (
    <React.Fragment>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={true}
        onClick={null}
      >
        <Fade in={true} timeout={750}>
          <Box>
            <Typography variant="h3" align="center">
              Kies een taal om verder te gaan
            </Typography>
            <hr style={{ border: "3px solid #ff913a", color: "#ff913a" }} />
            <Typography variant="h3" align="center">
              Please select a language to continue
            </Typography>
            <IconButton onClick={() => changeLanguage("nl")}>
              <Flag code={"NL"} height={325} width={400} />
            </IconButton>
            <IconButton onClick={() => changeLanguage("en")}>
              <Flag code={"GB"} height={265} />
            </IconButton>
          </Box>
        </Fade>
      </Backdrop>
    </React.Fragment>
  );
};
export default LanguageSelect;
