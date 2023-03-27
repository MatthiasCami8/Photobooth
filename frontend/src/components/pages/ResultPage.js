import BrushIcon from "@mui/icons-material/Brush";
import { Fade, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { logEvent } from "firebase/analytics";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import QRCode from "qrcode.react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import {
  analytics,
  db, storage_portraits, storage_portraits_metadata, storage_results, storage_source_pictures
} from "../../utils/firebase";
import BottomAppBar from "../layout/BottomAppBar";
import HorizontalStepper from "../layout/HorizontalStepper";
import ShareAppBar from "../layout/ShareAppBar";
import { ImageItem } from "../media/ImageItem";

const ResultPage = (props) => {
  let navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = React.useState(false);

  const [resultImage, setResultImage] = React.useState(null);

  const [portrait, setPortrait] = React.useState({
    img: localStorage.getItem("portrait_url"),
  });

  const location = useLocation();
  const parseMuseum = (location) => {
    const urlParts = location.pathname.split("/");

    const routes = ["capture", "select", "deepfake", "result"];
    if (routes.includes(urlParts[1])) {
      return "default";
    } else {
      return urlParts[1];
    }
  };
  const museum = parseMuseum(location);

  const [height, setHeight] = React.useState(window.innerHeight);
  const [width, setWidth] = React.useState(window.innerWidth);
  const breakpoint = 850;

  React.useEffect(() => {
    window.addEventListener("resize", () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    });
  }, []);

  const getShareURL = () => {
    const path = window.location.href.split("?")[0];
    if (path.slice(-1) === "/") {
      return `${path}share/${localStorage.getItem("source_image_id")}`;
    } else {
      return `${path}/share/${localStorage.getItem("source_image_id")}`;
    }
  };
  const art_href = searchParams.get("href");
  const shareURL = getShareURL();

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
      console.error(err);
    });
  }, []);

  React.useEffect(() => {
    getResultImage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getResultImage = () => {
    const storageRef = ref(
      storage_results,
      `${museum}/${localStorage.getItem("source_image_id")}`
    );
    getDownloadURL(storageRef)
      .then((res) => {
        setResultImage(res);
      })
      .catch((err) => {
        setError(error);
        console.error(error);
      });
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
            console.error(err);
          });
      })
      .catch((err) => {
        setError(true);
        console.error(err);
      });
  };

  const onChoseAnotherImage = () => {
    const new_image_id = uuidv4();
    localStorage.setItem("source_image_id", new_image_id);
    resetPictureUUID(new_image_id, localStorage.getItem("user_image"));
  };
  const { t } = useTranslation();

  const renderMobile = () => {
    return (
      <React.Fragment>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          wrap="nowrap"
          spacing={0}
          sx={{ height: "100%", paddingX: 4, paddingBottom: 4 }}
        >
          <Grid item xs={6}>
            <Fade in={true} timeout={1500}>
              <Box>
                <Typography variant="h4" align="center" gutterBottom>
                  The result
                </Typography>
                <img
                  src={resultImage}
                  alt="Result"
                  style={{
                    objectFit: "scale-down",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Box>
            </Fade>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <ShareAppBar
          url={resultImage}
          secondFabIcon={<BrushIcon />}
          onClickSecondFab={() => onChoseAnotherImage()}
          caption={`${t("Share")} | ${t("SelectOther")}`}
        />
      </React.Fragment>
    );
  };
  const renderDesktop = () => {
    return (
      <React.Fragment>
        <Grid container sx={{ height: "100%", overflow: "hidden" }}>
          <Grid container xs={12}>
            <Grid item xs={5}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <ImageItem
                  className="animate__animated animate__fadeIn animate__delay-1s"
                  artist={t("You")}
                  date={new Date().getFullYear()}
                  title={t("TakenPictureCaption")}
                >
                  <img
                    src={localStorage.getItem("user_image")}
                    style={{
                      objectFit: "scale-down",
                      maxHeight: Math.max(300, height * 0.3),
                    }}
                    alt="you"
                  />
                </ImageItem>

                <Typography
                  className="animate__animated animate__fadeIn animate__delay-2s"
                  variant="h1"
                  style={{ color: "#ff913a" }}
                  align="center"
                >
                  +
                </Typography>

                <ImageItem
                  className={
                    "animate__animated animate__fadeIn animate__delay-2s"
                  }
                  {...portrait}
                  subTitle={t("ChosenImage")}
                >
                  <img
                    src={portrait.img}
                    alt="portrait"
                    style={{
                      objectFit: "scale-down",
                      maxHeight: Math.max(300, height * 0.3),
                    }}
                  />
                </ImageItem>
              </Box>
            </Grid>
            <Grid item xs={1}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",

                  height: "100%",
                }}
              >
                <Typography
                  className="animate__animated animate__fadeIn animate__delay-3s"
                  variant="h1"
                  style={{ color: "#ff913a" }}
                  align="center"
                >
                  =
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Box className="animate__animated animate__fadeIn animate__delay-3s">
                  <Typography variant="h4" align="center">
                    {t("TheResult")}
                  </Typography>
                  <img
                    src={resultImage}
                    alt="result"
                    style={{
                      maxHeight: Math.max(300, height * 0.4),
                      objectFit: "scale-down",
                    }}
                  />
                </Box>

                <Box
                  className="animate__animated animate__fadeInUp animate__delay-5s"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <QRCode
                    renderAs="svg"
                    onClick={() => {
                      if (museum === "default") {
                        window.open(shareURL);
                      }
                    }}
                    size={150}
                    includeMargin
                    style={{ marginTop: "8px" }}
                    value={shareURL}
                  // imageSettings={{
                  //   src: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/tpxodgwzh1sg5eisv0wu",
                  //   height: 25,
                  //   width: 25,
                  // }}
                  />

                  <Typography
                    variant="h6"
                    align="center"
                    sx={{ zIndex: 9999 }}
                    gutterBottom
                  >
                    {t("ScanQR")}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <BottomAppBar
          firstFabIcon={<BrushIcon />}
          onClickFirstFab={() => {
            logEvent(analytics, "selected_other_image");
            onChoseAnotherImage();
          }}
          caption={t("SelectOtherPainting")}
        />
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <HorizontalStepper activeStep={3} />
      {height < breakpoint || width < breakpoint
        ? renderMobile()
        : renderDesktop()}
    </React.Fragment>
  );
};

export default ResultPage;
