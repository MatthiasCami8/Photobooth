import { Fade, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import ML6_logo from "../../assets/logos/ml6_logo.png";

const ScreenSaver = (props) => {
  const [top, setTop] = React.useState("50%");
  const [left, setLeft] = React.useState("50%");
  const mx = 600;
  const my = 300;
  const animationInterval = 5000;

  React.useEffect(() => {
    document.addEventListener("mousedown", props.onClick);
    return () => {
      document.removeEventListener("mousedown", props.onClick);
    };
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      animate();
    }, animationInterval);
    return () => clearInterval(interval);
  }, []);

  const animate = () => {
    setTop(randInt(0, window.screen.height - my));
    setLeft(randInt(0, window.screen.width - mx));
  };
  const randInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const renderLogos = () => {
    return (
      <React.Fragment>
        <img src={ML6_logo} alt="ml6" width={125} />
      </React.Fragment>
    );
  };
  const Content = (props) => {
    return (
      <Fade in={true} timeout={750}>
        <Box
          sx={{
            position: "fixed",
            top: props.top,
            left: props.left,
            width: "fit-content",
          }}
        >
          <Typography variant="h2" sx={{ color: "white" }}>
            DeepFake photobooth
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" sx={{ color: "#ff913a" }}>
              Powered by
            </Typography>
            {renderLogos()}
          </Box>

          <Typography variant="h6" align="center" sx={{ color: "#3B88FF" }}>
            Press anywhere to start
          </Typography>
        </Box>
      </Fade>
    );
  };
  return <Content top={top} left={left} />;
};

export default ScreenSaver;
