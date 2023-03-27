import "animate.css";

import {
  Box, ImageList,
  ImageListItem, Skeleton
} from "@mui/material";
import axios from "axios";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import React from "react";
import { useLocation } from "react-router-dom";
import {
  storage_portraits,
  storage_portraits_metadata
} from "../../utils/firebase";
import { ImageItem } from "./ImageItem";

const classes = {
  chosenImage: {
    border: "3px dashed #ff913a",
    height: "100%",
    maxHeight: "500px",
    width: "100%",
    objectFit: "cover",
  },
  regularImage: {
    border: "2px dashed black",
    height: "100%",
    maxHeight: "500px",
    width: "100%",
    objectFit: "cover",
  },
};

const ArtSelector = React.forwardRef((props, forwardRef) => {
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

  const breakpoint = 620;

  React.useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
  }, []);

  const [images, setImages] = React.useState([]);
  const [finishedLoadingImages, setFinishedLoadingImages] =
    React.useState(false);
  const [chosenImage, setChosenImage] = React.useState(-1);

  React.useEffect(() => {
    loadImages().catch((error) => {
      console.error(error);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadImages = async () => {
    // Setup
    const portraitsRef = ref(storage_portraits, museum);
    const metadataRef = ref(storage_portraits_metadata, museum);
    // Get all portrait files and metadata files in corresponding storage endpoints
    const [portraitResponse, metadataResponse] = await Promise.all([
      listAll(portraitsRef),
      listAll(metadataRef),
    ]);

    let imageDownloadPromises = [];
    let imageNames = [];
    let imagePaths = [];

    // Parse portrait reponse to get download urls and names
    portraitResponse.items.forEach((itemRef) => {
      imageDownloadPromises.push(
        getDownloadUrlForPath(storage_portraits, itemRef._location.path_)
      );
      imageNames.push(
        itemRef._location.path_
          .replace("./", "")
          .replace(/\.[^/.]+$/, "")
          .replace(`${museum}/`, "")
      );
      imagePaths.push(itemRef._location.path_);
    });

    let metadataDownloadPromises = [];
    let metadataNames = [];

    // Parse metadata reponse to get download urls names
    metadataResponse.items.forEach((itemRef) => {
      metadataDownloadPromises.push(
        getDownloadUrlForPath(
          storage_portraits_metadata,
          itemRef._location.path_
        ).then((url) => {
          return axios.get(url);
        })
      );
      metadataNames.push(
        itemRef._location.path_
          .replace("./", "")
          .replace(/\.[^/.]+$/, "")
          .replace(`${museum}/`, "")
      );
    });

    // Retrieve data from download urls (combined to run async)
    const combinedResponse = await Promise.all([
      ...metadataDownloadPromises,
      ...imageDownloadPromises,
    ]);
    const metadataDownloadResponse = combinedResponse.slice(
      0,
      metadataDownloadPromises.length
    );
    const imageDownloadResponse = combinedResponse.slice(
      metadataDownloadPromises.length
    );

    // Extract metadata from response
    let metadata = [];
    metadataDownloadResponse.forEach((res, index) => {
      metadata.push({
        ...res.data,
        name: metadataNames[index],
      });
    });

    let images = [];
    // Combine image data with metadata
    imageDownloadResponse.forEach((imageUrl, index) => {
      const imageName = imageNames[index];
      let metadataItem = metadata.find((element) => element.name == imageName);
      if (metadataItem && "url" in metadataItem) {
        delete metadataItem["url"];
      }

      images.push({
        // title: imageNames[index],
        img: imageUrl,
        path: imagePaths[index],
        ...metadataItem,
      });
    });
    setFinishedLoadingImages(true);
    setImages(images);
  };

  const getDownloadUrlForPath = (bucket, path) => {
    const storageRef = ref(bucket, path);
    return getDownloadURL(storageRef);
  };

  const renderSkeleton = () => {
    return Array(20)
      .fill(0)
      .map((_, index) => (
        <ImageListItem key={index}>
          <Skeleton
            variant="rectangular"
            style={{
              backgroundColor: "#494949",
              height: "100%",
              maxHeight: "500px",
              width: "100%",
              objectFit: "cover",
            }}
          ></Skeleton>
        </ImageListItem>
      ));
  };

  const renderImages = () => {
    return images.map((item, index) => (
      <Box
        className={"animate__animated animate__fadeIn animate__delay-1s"}
        sx={{ display: "flex" }}
      >
        <ImageItem
          key={props.img}
          className={
            index !== chosenImage
              ? ""
              : "animate__animated animate__pulse animate__infinite animate__slower"
          }
          style={{
            zIndex: index === chosenImage ? 9999 : 0,
          }}
          {...item}
        >
          <img
            src={`${item.img}`}
            srcSet={`${item.img}`}
            alt={item.title}
            loading="eager"
            onClick={() => {
              setChosenImage(index);
              props.onChoseImage(images[index]);
            }}
            style={
              index !== chosenImage ? classes.regularImage : classes.chosenImage
            }
          />
        </ImageItem>
      </Box>
    ));
  };
  return (
    <ImageList
      cols={width < breakpoint ? 3 : 4}
      gap={4}
      sx={{
        height: height > width ? "60%" : "85%",
        overflowX: "hidden",
        padding: 2,
      }}
    >
      {finishedLoadingImages ? renderImages() : renderSkeleton()}
    </ImageList>
  );
});

export default ArtSelector;
