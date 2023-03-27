import { Fade, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import AxeleraScreensaver from "../../assets/screensavers/axelera_screensaver.png";

const ScreenSaver = (props) => {
  React.useEffect(() => {
    document.addEventListener("mousedown", props.onClick);
    return () => {
      document.removeEventListener("mousedown", props.onClick);
    };
  }, []);

  return (
    <Fade in={true} timeout={750}>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          backgroundImage: `url(${AxeleraScreensaver})`,
          backgroundColor: "black",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Stack
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
          height="100vh"
          paddingTop="65vh"
        >
          <Typography variant="h1" fontWeight="bold" color="white">
            Touch anywhere to start
          </Typography>
        </Stack>
      </Box>
    </Fade>
  );
};

export default ScreenSaver;
