import { React, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import QRCode from "qrcode.react";
import { useTranslation } from "react-i18next";

const NotFound = (props) => {
  return (
    <Box>
      <Typography variant="h1" align="center">
        The route you requested is not valid
      </Typography>
    </Box>
  );
};

export default NotFound;
