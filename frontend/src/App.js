import "./locales/config";
import "./style/app.scss";
import "./style/app.scss";

import { Container } from "@mui/material";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import { logEvent } from "firebase/analytics";
import {
  collection,
  getDocsFromServer,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useIdleTimer } from "react-idle-timer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import IdleBackdrop from "./components/functionality/IdleBackdrop";
import ScreenSaver from "./components/functionality/ScreenSaver";
import TitleBar from "./components/layout/TitleBar";
import PrivacyPolicy from "./components/PrivacyPolicy";
import { analytics, db } from "./utils/firebase";
import AdminPanel from "./components/functionality/AdminPanel";

const theme = createTheme({
  typography: {
    h1: { fontSize: "5rem" },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 425,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
      "3xl": 1920,
      "4xl": 2560,
      "5xl": 3200,
    },
  },
});
const App = (props) => {
  const idleTimeout = 1000 * 60 * 5;
  const navigate = useNavigate();
  const location = useLocation();
  const [idle, setIdle] = React.useState(false);
  const [screenSaving, setScreenSaving] = React.useState(false);

  const [openAdminPanel, setOpenAdminPanel] = React.useState(false);
  const [width, setWidth] = React.useState(window.innerWidth);
  const breakpoint = 620;

  React.useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  // Hotkeys to switch between image selection
  useHotkeys(
    "ctrl+1",
    (event) => {
      event.preventDefault();
      localStorage.setItem("version", "default");
      window.location.reload();
    },
    []
  );

  useHotkeys(
    "ctrl+2",
    (event) => {
      event.preventDefault();
      localStorage.setItem("version", "rijksmuseum");
      window.location.reload();
    },
    []
  );

  useHotkeys(
    "ctrl+3",
    (event) => {
      event.preventDefault();
      localStorage.setItem("version", "youseum");
      window.location.reload();
    },
    []
  );

  useHotkeys(
    "ctrl+4",
    (event) => {
      event.preventDefault();
      localStorage.setItem("version", "datanews");
      window.location.reload();
    },
    []
  );

  useHotkeys(
    "ctrl+r",
    (event) => {
      event.preventDefault();
      let newRotation =
        (parseInt(localStorage.getItem("camera_rotation")) + 90) % 360;
      if (isNaN(parseFloat(newRotation))) {
        newRotation = 0;
      }
      localStorage.setItem("camera_rotation", newRotation);
      window.location.reload();
    },
    []
  );

  useHotkeys(
    "ctrl+m",
    (event) => {
      event.preventDefault();
      if (localStorage.getItem("cursor") === "none") {
        localStorage.setItem("cursor", "auto");
      } else {
        localStorage.setItem("cursor", "none");
      }
      window.location.reload();
    },
    []
  );
  useHotkeys(
    "ctrl+a",
    (event) => {
      event.preventDefault();
      setOpenAdminPanel(true);
    },
    []
  );

  const handleOnIdle = (event) => {
    if (width < breakpoint) {
      // Ignore idle when in mobile format
      return;
    }
    const routes = ["capture", "select", "deepfake", "result"];
    for (var i = 0; i < routes.length; i++) {
      if (location.pathname.includes(routes[i])) {
        setIdle(true);
        return;
      }
    }
    // setScreenSaving(true);
  };

  const parseMuseum = (location) => {
    const urlParts = location.pathname.split("/");

    const routes = ["capture", "select", "deepfake", "result"];
    if (routes.includes(urlParts[1])) {
      return "";
    } else {
      return urlParts[1];
    }
  };

  const handleRemainIdle = () => {
    setIdle(false);
    logEvent(analytics, "idle_timeout");

    const museum = parseMuseum(location);
    setTimeout(() => {
      window.location.reload(true);
    }, 2000);
    navigate(`../${museum}`);
  };

  const handleOnActive = (event) => {
    // console.log("user is active", event);
    // console.log("time remaining", getRemainingTime());
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: idleTimeout,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    debounce: 250,
  });

  return (
    <ThemeProvider
      theme={responsiveFontSizes(theme, {
        breakpoints: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"],
        factor: 5,
      })}
    >
      {screenSaving ? (
        <ScreenSaver onClick={() => setScreenSaving(false)} />
      ) : (
        <Container
          className={`App`}
          sx={{ pt: "64px", pb: "128px" }}
          maxWidth={"xl"}
        >
          <TitleBar />
          {width < breakpoint ? null : <PrivacyPolicy />}

          <Outlet />
        </Container>
      )}
      {idle && (
        <IdleBackdrop
          onRemainIdle={handleRemainIdle}
          onActive={() => setIdle(false)}
        />
      )}
      <AdminPanel
        open={openAdminPanel}
        handleClose={() => {
          setOpenAdminPanel(false);
          window.location.reload();
        }}
      />
    </ThemeProvider>
  );
};
export default App;
