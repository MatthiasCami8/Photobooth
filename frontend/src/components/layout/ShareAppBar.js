import ShareIcon from "@mui/icons-material/Share";
import {
  AppBar,
  Fab,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { RWebShare } from "react-web-share";

const StyledFabSingle = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -40,
  left: 0,
  right: 0,
  margin: "0 auto",
});

const StyledFabFirst = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -40,
  left: -100,
  right: 0,
  margin: "0 auto",
});

const StyledFabSecond = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -40,
  left: 100,
  right: 0,
  margin: "0 auto",
});

const ShareAppBar = (props) => {
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = React.useState(i18n.language);
  const handleLocale = (_, language) => {
    localStorage.setItem("locale", language);
    i18n.changeLanguage(language);
    setLocale(language);
    // window.location.reload(false);
  };

  return (
    <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
      <Toolbar>
        <Grid container spacing={0} alignItems="center">
          <Grid item xs={2}></Grid>
          <Grid container item xs justifyContent="center">
            {!props.secondFabIcon ? (
              <RWebShare
                data={{
                  text: t("ShareMessageText"),
                  url: props.url,
                  title: "DeepFake Photobooth",
                }}
              >
                <StyledFabSingle aria-label="share" color="secondary">
                  <ShareIcon />
                </StyledFabSingle>
              </RWebShare>
            ) : (
              <React.Fragment>
                <RWebShare
                  data={{
                    text: t("ShareMessageText"),
                    url: props.url,
                    title: "DeepFake Photobooth",
                  }}
                >
                  <StyledFabFirst aria-label="share" color="secondary">
                    <ShareIcon />
                  </StyledFabFirst>
                </RWebShare>
                <StyledFabSecond
                  aria-label="add"
                  color={
                    props.colorSecondFab ? props.colorSecondFab : "success"
                  }
                  onClick={props.onClickSecondFab}
                >
                  {props.secondFabIcon}
                </StyledFabSecond>
              </React.Fragment>
            )}
            <Typography align="center">{props.caption}</Typography>
          </Grid>
          <Grid container item xs={2} justifyContent="flex-end">
            <ToggleButtonGroup
              sx={{ backgroundColor: "white" }}
              value={locale}
              exclusive
              size={"small"}
              onChange={handleLocale}
            >
              <ToggleButton value="en">EN</ToggleButton>
              <ToggleButton value="nl">NL</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default ShareAppBar;
