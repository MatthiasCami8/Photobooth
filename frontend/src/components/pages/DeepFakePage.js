import "animate.css";

import ClearIcon from "@mui/icons-material/Clear";
import { Box, Grid, LinearProgress, Typography } from "@mui/material";
import { logEvent } from "firebase/analytics";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  analytics,
  db,
  storage_source_pictures,
  storage_swap_pictures,
  storage_portraits_metadata,
  storage_portraits,
} from "../../utils/firebase";
import BottomAppBar from "../layout/BottomAppBar";
import HorizontalStepper from "../layout/HorizontalStepper";
import { ImageItem } from "../media/ImageItem";

const DeepFakePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [progress, setProgress] = React.useState(null);
  const [cancelPossible, setCancelPossible] = React.useState(false);
  const [canceled, setCanceled] = React.useState(false);
  const [finishedDeepFake, setFinishedDeepfake] = React.useState(false);

  const [portrait, setPortrait] = React.useState({
    img: localStorage.getItem("portrait_url"),
  });
  const location = useLocation();
  const parseMuseum = (location) => {
    const urlParts = location.pathname.split("/");
    const routes = ["capture", "select", "deepfake"];
    if (routes.includes(urlParts[1])) {
      return "default";
    } else {
      return urlParts[1];
    }
  };

  const [height, setHeight] = React.useState(window.innerHeight);

  const breakpoint = 620;

  React.useEffect(() => {
    window.addEventListener("resize", () => setHeight(window.innerHeight));
  }, []);

  const museum = parseMuseum(location);

  const source_image_id = localStorage.getItem("source_image_id");
  const art_href = searchParams.get("href");

  let navigate = useNavigate();

  const { t } = useTranslation();

  let progressTimer = null;

  const loadPortrait = async () => {
    const portraitRef = ref(storage_portraits, art_href);
    const metadataRef = ref(
      storage_portraits_metadata,
      art_href.replace(".jpg", ".json")
    );
    const [imageUrl, metadataResponse] = await Promise.all([
      getDownloadURL(portraitRef),
      getDownloadURL(metadataRef).then((url) => {
        return axios.get(url);
      }),
    ]);

    console.log({ img: imageUrl, ...metadataResponse.data });
    setPortrait({ img: imageUrl, ...metadataResponse.data });
  };

  React.useEffect(() => {
    loadPortrait().catch((err) => {
      console.log(err);
    });
  }, []);

  React.useEffect(() => {
    const document = doc(db, museum, source_image_id);

    updatePortraitPicture(document).catch((err) => {
      setError(true);
      console.log(err);
    });
    uploadToStorage(`${museum}/${source_image_id}`, "").catch((err) => {
      setError(true);
      console.log(err);
    });
    const unsubscribe = onSnapshot(document, (item) => {
      if (
        "done" in item.data() &&
        item.data().portrait_file === art_href &&
        item.data().done === true
      ) {
        clearTimeout(progressTimer);
        setLoading(false);
        setFinishedDeepfake(true);
        setProgress(100);
        unsubscribe();
      }
    });
  }, []);

  React.useEffect(() => {
    if (finishedDeepFake) {
      const timer = setTimeout(() => {
        navigate(`../result/?href=${art_href}`);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [finishedDeepFake]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCancelPossible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const uploadToStorage = async (destFileName, contents) => {
    await uploadString(ref(storage_swap_pictures, destFileName), contents);
  };

  const updatePortraitPicture = async (document) => {
    await updateDoc(document, { portrait_file: art_href, done: false });
  };

  const resetPictureUUID = (uuid, contents) => {
    uploadString(
      ref(storage_source_pictures, `${museum}/${uuid}`),
      contents,
      "data_url"
    )
      .then((res) => {
        const document = doc(db, museum, uuid);
        setDoc(document, { timestamp: new Date().toISOString(), n_faces: 1 })
          .then(() => {
            navigate("../select");
          })
          .catch((err) => {
            setError(true);
            console.log(err);
          });
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      });
  };

  React.useEffect(() => {
    progressTimer = setInterval(() => {
      if (progress >= 90) {
      }
      setProgress((prevProgress) =>
        prevProgress >= 90 ? 90 : prevProgress + getRandomInt(0, 7)
      );
    }, 250);
    return () => {
      clearInterval(progressTimer);
    };
  }, []);

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const onCancel = () => {
    const new_image_id = uuidv4();
    localStorage.setItem("source_image_id", new_image_id);
    setCanceled(true);
    resetPictureUUID(new_image_id, localStorage.getItem("user_image"));
  };

  const renderProgressText = () => {
    let text = "";
    if (progress < 25) {
      text = t("StartingProcess");
    } else if (progress < 60) {
      text = t("GettingThere");
    } else if (progress < 90) {
      text = t("AlmostDone");
    } else if (progress < 100) {
      text = t("AnyMinute");
    } else if (progress >= 100) {
      text = t("Done!");
    }
    return (
      <Box
        className="animate__animated animate__fadeInDown"
        key={text}
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" align="center">
          {text}
        </Typography>
      </Box>
    );
  };

  return (
    <React.Fragment>
      <HorizontalStepper activeStep={2} />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        wrap="nowrap"
        sx={{ height: "100%" }}
      >
        <Grid
          container
          item
          xs={10}
          alignItems="center"
          sx={{ height: "100%" }}
        >
          <Grid item xs={5}>
            <ImageItem
              className={"animate__animated animate__fadeIn "}
              artist={t("You")}
              date={new Date().getFullYear()}
              title={t("TakenPictureCaption")}
            >
              <img src={localStorage.getItem("user_image")} alt="you" />
            </ImageItem>
          </Grid>
          <Grid item xs={2}>
            <Typography
              variant="h1"
              style={{ color: "#ff913a" }}
              align="center"
            >
              +
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <ImageItem
              className={"animate__animated animate__fadeIn animate__delay-1s"}
              {...portrait}
              style={{ verticalAlign: "top" }}
              subTitle={t("ChosenImage")}
            >
              <img
                src={portrait.img}
                alt="portrait"
                style={{
                  maxHeight: Math.max(300, height * 0.5),
                  objectFit: "scale-down",
                }}
              />
            </ImageItem>
          </Grid>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            width: "100%",
            alignItems: "center",
            height: "100%",
            width: "100%",
            paddingBottom: 10,
            paddingTop: 4,
          }}
        >
          {!canceled && renderProgressText()}
          {!canceled && (
            <LinearProgress
              variant="determinate"
              value={progress}
              color="inherit"
              style={{ color: "#ff913a", height: 3 }}
            />
          )}
        </Grid>
      </Grid>

      <BottomAppBar
        firstFabIcon={!canceled && <ClearIcon />}
        colorFirstFab="error"
        caption={t("Cancel")}
        onClickFirstFab={() => {
          if (cancelPossible) {
            const new_image_id = uuidv4();
            localStorage.setItem("source_image_id", new_image_id);
            logEvent(analytics, "canceled_deepfake");
            onCancel();
          }
        }}
      />
    </React.Fragment>
  );
};

export default DeepFakePage;
