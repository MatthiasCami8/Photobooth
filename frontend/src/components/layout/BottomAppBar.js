import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  AppBar,
  ButtonGroup,
  Fab,
  Grid,
  IconButton,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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

const BottomAppBar = (props) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = React.useState(i18n.language);

  const handleLocale = (_, language) => {
    localStorage.setItem("locale", language);
    i18n.changeLanguage(language);
    setLocale(language);
    // window.location.reload(false);
  };

  const [width, setWidth] = React.useState(window.innerWidth);
  const breakpoint = 620;
  React.useEffect(() => {
    /* Inside of a "useEffect" hook add an event listener that updates
       the "width" state variable when the window size changes */
    window.addEventListener("resize", () => setWidth(window.innerWidth));

    /* passing an empty array as the dependencies of the effect will cause this
       effect to only run when the component mounts, and not each time it updates.
       We only want the listener to be added once */
  }, []);

  const renderActionButtons = () => {
    if (width > breakpoint) {
      return (
        <ButtonGroup
          disableElevation
          variant="contained"
          color="warning"
          size="large"
        >
          <Button
            color="primary"
            startIcon={<KeyboardReturnIcon />}
            style={{
              display: props.onBack && width > breakpoint ? "" : "none",
            }}
            onClick={props.onBack}
          >
            {t("Back")}
          </Button>
          <Button
            color="primary"
            onClick={() => navigate("../")}
            startIcon={<RestartAltIcon />}
          >
            {t("Restart")}
          </Button>
        </ButtonGroup>
      );
    } else {
      return (
        <ButtonGroup disableElevation variant="contained" size="large">
          <IconButton
            color="inherit"
            size="large"
            style={{
              display: props.onBack && width > breakpoint ? "" : "none",
            }}
            onClick={props.onBack}
          >
            <KeyboardReturnIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => navigate("../")}
            size="large"
          >
            <RestartAltIcon />
          </IconButton>
        </ButtonGroup>
      );
    }
  };
  return (
    <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
      <Toolbar
        style={{
          paddingLeft: width < breakpoint ? 4 : 16,
          paddingRight: width < breakpoint ? 4 : 16,
        }}
      >
        <Grid container spacing={0} alignItems="center">
          <Grid item xs={2}>
            {renderActionButtons()}
          </Grid>
          <Grid container item xs justifyContent="center">
            {props.firstFabIcon && !props.secondFabIcon ? (
              <StyledFabSingle
                aria-label="add"
                color={props.colorFirstFab ? props.colorFirstFab : "secondary"}
                onClick={props.onClickFirstFab}
              >
                {props.firstFabIcon}
              </StyledFabSingle>
            ) : null}
            {props.firstFabIcon && props.secondFabIcon ? (
              <React.Fragment>
                <StyledFabFirst
                  aria-label="add"
                  color="error"
                  onClick={props.onClickFirstFab}
                >
                  {props.firstFabIcon}
                </StyledFabFirst>
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
            ) : null}
            <Typography variant={"overline"}>{props.caption}</Typography>
          </Grid>
          <Grid container item xs={2} justifyContent="flex-end">
            <ToggleButtonGroup
              sx={{ backgroundColor: "white" }}
              value={locale}
              exclusive
              size={width < breakpoint ? "small" : "large"}
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

export default BottomAppBar;
