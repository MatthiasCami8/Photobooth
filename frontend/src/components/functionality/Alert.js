import "animate.css";

import { Alert, AlertTitle, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles({
  faceAlert: {
    "& .MuiAlert-icon": {
      fontSize: 48,
    },
  },
});

const IdleBackdrop = (props) => {
  const classes = useStyles();
  const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || "";

  const default_animation = "animate__animated animate__fadeInUp";
  return (
    <React.Fragment>
      <Alert
        severity={props.severity}
        className={classes.idleAlert + " " + default_animation}
        {...props}
      >
        {props.renderTitle && (
          <AlertTitle>
            <Typography sx={{ fontWeight: "bold" }}>
              {capitalize(props.severity)}
            </Typography>
          </AlertTitle>
        )}

        <Typography>{props.text}</Typography>
      </Alert>
    </React.Fragment>
  );
};

export default IdleBackdrop;
