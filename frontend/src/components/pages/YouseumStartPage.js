import SensorsIcon from "@mui/icons-material/Sensors";
import { Grid, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const YouseumStartPage = () => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Grid
        container
        direction="column"
        justifyContent="center"
        sx={{ height: "100%" }}
      >
        <Grid item xs={4}>
          <Typography variant="h4" align="center">
            {t("YouseumStartMessage")}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h2" align="center" style={{ color: "#ff913a" }}>
            <SensorsIcon fontSize="inherit" />
          </Typography>
          <Typography variant="h4" align="center">
            {t("YouseumGettingStarted")}
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default YouseumStartPage;
