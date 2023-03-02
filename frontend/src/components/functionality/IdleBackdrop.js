import {
  Alert,
  AlertTitle,
  Backdrop,
  Box,
  Slide,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  faceAlert: {
    "& .MuiAlert-icon": {
      fontSize: 48,
    },
  },
});

const IdleBackdrop = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const idleTimeout = 1000 * 30;
  React.useEffect(() => {
    const timer = setTimeout(() => {
      props.onRemainIdle();
    }, idleTimeout);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <Box>
        <Backdrop
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={true}
          onClick={props.onActive}
          transitionDuration={idleTimeout}
        />
        <Slide direction={"down"} in={true} timeout={2500}>
          <Alert
            className={classes.idleAlert}
            severity="warning"
            variant="filled"
            sx={{
              position: "absolute",
              top: -2,
              zIndex: 99999,
            }}
          >
            <AlertTitle>
              <Typography sx={{ fontWeight: "bold" }}>
                {t("Inactivity")}
              </Typography>
            </AlertTitle>
            <Typography>{t("StillThere")} </Typography>
          </Alert>
        </Slide>
      </Box>
    </React.Fragment>
  );
};

export default IdleBackdrop;
