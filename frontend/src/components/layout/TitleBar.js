import { AppBar, Typography } from "@mui/material";
import { Box } from "@mui/system";

import ML6_logo from "../../assets/logos/ml6_logo.png";

const TitleBar = (props) => {
  return (
    <AppBar
      position="fixed"
      color="transparent"
      sx={{ top: 0, bottom: "auto" }}
    >
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">DeepFake Photobooth by</Typography>
        <img
          src={ML6_logo}
          alt="ml6"
          height={40}
          style={{ objectFit: "cover" }}
        />
      </Box>
    </AppBar>
  );
};

export default TitleBar;
