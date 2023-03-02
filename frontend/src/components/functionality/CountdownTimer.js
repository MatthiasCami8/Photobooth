import "animate.css";

import { Typography, Box } from "@mui/material";
import React from "react";

const CountdownTimer = (props) => {
  const [remainingTime, setRemainingTime] = React.useState(null);

  const minSize = 40;
  const maxSize = 150;

  const minHeight = 600;
  const maxHeight = 1200;

  const calculcateSize = (height) => {
    const OldRange = maxHeight - minHeight;
    const NewRange = maxSize - minSize;
    return ((height - minHeight) * NewRange) / OldRange + minSize;
  };

  const [size, setsize] = React.useState(calculcateSize(window.innerHeight));

  React.useEffect(() => {
    /* Inside of a "useEffect" hook add an event listener that updates
       the "width" state variable when the window size changes */
    window.addEventListener("resize", () => {
      setsize(calculcateSize(window.innerHeight));
    });

    /* passing an empty array as the dependencies of the effect will cause this
       effect to only run when the component mounts, and not each time it updates.
       We only want the listener to be added once */
  }, []);

  React.useEffect(() => {
    if (!props.isPlaying) {
      setRemainingTime(props.duration - 1);
    }
  }, [props]);

  React.useEffect(() => {
    if (props.isPlaying) {
      const interval = setInterval(() => {
        if (remainingTime === 0) {
          clearInterval(interval);
          props.onComplete();
        } else {
          setRemainingTime((remainingTime) => remainingTime - 1);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [props, remainingTime, setRemainingTime]);

  return (
    <React.Fragment>
      <Box
        sx={{
          width: size,
          height: size,
          border: "6px inset #ff913a",
          borderRadius: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          className={
            props.isPlaying ? "animate__animated animate__fadeInDown" : ""
          }
          variant="h2"
          align="center"
          key={remainingTime}
        >
          {props.isPlaying ? remainingTime : props.duration}
        </Typography>
      </Box>
    </React.Fragment>
  );
};

export default CountdownTimer;
