import "animate.css";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import SouthIcon from "@mui/icons-material/South";
import { Box, Grid, LinearProgress, Typography } from "@mui/material";
import { logEvent } from "firebase/analytics";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { ref, uploadString } from "firebase/storage";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { v4 as uuidv4 } from "uuid";

import { analytics, db, storage_source_pictures } from "../../utils/firebase";
import Alert from "../functionality/Alert";
import CountdownTimer from "../functionality/CountdownTimer";
import Flash from "../functionality/Flash";
import BottomAppBar from "../layout/BottomAppBar";
import HorizontalStepper from "../layout/HorizontalStepper";
import { ImageItem } from "../media/ImageItem";

const videoConstraints = {
  facingMode: "user",
  rotation: localStorage.getItem("camera_rotation")
    ? parseInt(localStorage.getItem("camera_rotation"))
    : 0,
};

const WebcamCapturePage = () => {
  let navigate = useNavigate();
  const { t } = useTranslation();

  const webcamRef = React.useRef(null);
  const [loadingWebcam, setLoadingWebcam] = React.useState(true);
  const [capturing, setCapturing] = React.useState(false);
  const [finishedCapturing, setFinishedCapturing] = React.useState(false);
  const [uploadedFirestore, setUploadedFirestore] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [isFlashing, setIsFlashing] = React.useState(false);
  const [faceCount, setFaceCount] = React.useState(null);
  const [capturedImage, setCapturedImage] = React.useState(null);

  let unsubscribe = null;

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

  const museum = parseMuseum(location);

  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);
  const breakpoint = 900;

  React.useEffect(() => {
    /* Inside of a "useEffect" hook add an event listener that updates
       the "width" state variable when the window size changes */
    window.addEventListener("resize", () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    });

    /* passing an empty array as the dependencies of the effect will cause this
       effect to only run when the component mounts, and not each time it updates.
       We only want the listener to be added once */
  }, []);

  const reset = () => {
    if (unsubscribe) {
      unsubscribe();
    }
    setCapturing(false);
    setFinishedCapturing(false);
    setUploadedFirestore(false);
    setFaceCount(null);
    setCapturedImage(false);
  };
  const capture = () => {
    setIsFlashing(true);
    setCapturing(false);
    setFinishedCapturing(true);

    rotateBase64(
      webcamRef.current.getScreenshot(),
      videoConstraints.rotation,
      function (rotatedScreenshot) {
        setCapturedImage(rotatedScreenshot);
        localStorage.setItem("user_image", rotatedScreenshot);
        const image_id = uuidv4();
        localStorage.setItem("source_image_id", image_id);
        logEvent(analytics, "captured_image", { id: image_id });
        uploadFirestore(image_id);
        uploadToStorage(`${museum}/${image_id}`, rotatedScreenshot);
      }
    );
  };

  const uploadToStorage = (destFileName, contents) => {
    uploadString(
      ref(storage_source_pictures, destFileName),
      contents,
      "data_url"
    )
      .then((res) => { })
      .catch((err) => {
        setError(true);
        console.error(err);
      });
  };

  const uploadFirestore = (uuid) => {
    const document = doc(db, museum, uuid);
    if (!uploadedFirestore) {
      setDoc(document, { timestamp: new Date().toISOString() })
        .then(() => {
          setUploadedFirestore(true);
          unsubscribe = onSnapshot(document, (item) => {
            if ("faces_count" in item.data()) {
              let face_count = item.data().faces_count;
              // NOTE, in STAM there is no way to avoid multiple faces atm so this is always set to 1 to avoid showing an error in the frontend
              if (face_count > 1) {
                face_count = 1;
              }
              setFaceCount(face_count);
              unsubscribe();
            }
          });
        })
        .catch((err) => {
          setError(true);
          console.error(err);
        });
    }
  };

  function rotateBase64(srcBase64, degrees, callback) {
    const canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let image = new Image();

    image.onload = function () {
      canvas.width = degrees % 180 === 0 ? image.width : image.height;
      canvas.height = degrees % 180 === 0 ? image.height : image.width;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.drawImage(image, image.width / -2, image.height / -2);

      callback(canvas.toDataURL());
    };

    image.src = srcBase64;
  }

  const renderAppBar = () => {
    if (!capturing && !finishedCapturing) {
      return (
        <BottomAppBar
          onBack={() => navigate("../start")}
          firstFabIcon={loadingWebcam ? null : <CameraAltIcon />}
          onClickFirstFab={() => setCapturing(true)}
          caption={t("StartCountDown")}
        />
      );
    }
    if (error || faceCount === 0 || faceCount > 1) {
      return (
        <BottomAppBar
          onBack={() => reset()}
          firstFabIcon={<ReplayIcon />}
          onClickFirstFab={() => {
            logEvent(analytics, "retry", { type: "detect_faces" });
            reset();
          }}
          caption={t("GenericRetry")}
        />
      );
    }
    if (faceCount === 0 || faceCount > 1) {
      return (
        <BottomAppBar
          onBack={() => reset()}
          firstFabIcon={<ReplayIcon />}
          onClickFirstFab={() => reset()}
          secondFabIcon={<CheckIcon />}
          caption={t("RetakePicture")}
        />
      );
    }
    if (faceCount === 1) {
      return (
        <BottomAppBar
          onBack={() => reset()}
          firstFabIcon={<CloseIcon />}
          onClickFirstFab={() => {
            logEvent(analytics, "declined_taken_picture", {
              id: localStorage.getItem("source_image_id"),
            });
            reset();
          }}
          onClickSecondFab={() => {
            logEvent(analytics, "accepted_taken_picture", {
              id: localStorage.getItem("source_image_id"),
            });
            navigate(`../select/?nfaces=${faceCount}`);
          }}
          secondFabIcon={<CheckIcon />}
          caption={t("LookingGood")}
        />
      );
    }
    if (capturing) {
      return <BottomAppBar caption={t("SayCheese")} onBack={() => reset()} />;
    }
    return <BottomAppBar onBack={() => reset()} />;
  };

  const renderText = () => {
    if (!finishedCapturing && !loadingWebcam) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <CountdownTimer
            isPlaying={capturing}
            duration={3}
            onComplete={capture}
          />

          <Box
            sx={{
              visibility: capturing || finishedCapturing ? "hidden" : "",
            }}
          >
            {height > breakpoint && (
              <React.Fragment>
                <Typography variant="h5" align="center" sx={{ mt: 2 }}>
                  {t("PressButtonBelow")}
                </Typography>
                <Typography
                  className="animate__animated animate__pulse animate__infinite animate_fast"
                  variant="h2"
                  align="center"
                  style={{ color: "#ff913a" }}
                >
                  <SouthIcon fontSize="inherit" />
                </Typography>
              </React.Fragment>
            )}
          </Box>
        </Box>
      );
    }
    if (finishedCapturing && faceCount === null) {
      return (
        <Box>
          <Typography variant="h5" align="center" sx={{ mb: 2 }}>
            {t("MachineSearchingFace")} 🔍
          </Typography>
          <LinearProgress
            color="inherit"
            style={{ color: "#ff913a", height: 3 }}
          />
        </Box>
      );
    }
    if (error) {
      return (
        <Alert
          renderTitle={width > breakpoint}
          text={t("GenericErrorMessage")}
          severity="error"
        />
      );
    }
    if (faceCount === 0) {
      return (
        <Alert
          renderTitle={width > breakpoint}
          text={t("FaceNotVisible")}
          severity="error"
        />
      );
    }
    if (faceCount > 1) {
      return (
        <Alert
          renderTitle={width > breakpoint}
          text={t("MultipleFacesVisible")}
          severity="error"
        />
      );
    }
    if (faceCount === 1) {
      return (
        <Alert
          renderTitle={width > breakpoint}
          text={t("MachineLikesPicture")}
          severity="success"
        />
      );
    }
    return null;
  };

  return (
    <React.Fragment>
      <Flash flash={isFlashing} onAnimationEnd={() => setIsFlashing(false)} />
      <HorizontalStepper activeStep={0} />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        wrap="nowrap"
        spacing={0}
        sx={{ height: "100%" }}
      >
        <Grid
          item
          xs
          sx={{ mt: 4 }}
          container
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Box>
            <ImageItem
              className={"animate__animated animate__fadeIn animate__delay-2s"}
            >
              <Webcam
                style={{
                  transform: `rotate(${videoConstraints.rotation}deg)`,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: finishedCapturing ? "none" : "",
                  verticalAlign: "top",
                }}
                audio={false}
                mirrored
                forceScreenshotSourceSize
                onUserMedia={() => setLoadingWebcam(false)}
                ref={webcamRef}
                videoConstraints={videoConstraints}
                screenshotFormat="image/png"
                key={loadingWebcam}
              />
            </ImageItem>

            {capturedImage && (
              <ImageItem
                className={"animate__animated animate__fadeIn animate__slower"}
                artist={t("You")}
                date={new Date().getFullYear()}
                title={t("TakenPictureCaption")}
              >
                <img
                  src={capturedImage}
                  alt="You"
                  style={{ border: "2px dashed #ff913a" }}
                />
              </ImageItem>
            )}
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              width: "100%",
              paddingBottom: 10,
              mt: 2,
            }}
          >
            {renderText()}
          </Box>
        </Grid>
      </Grid>
      {renderAppBar()}
    </React.Fragment>
  );
};

export default WebcamCapturePage;
