import React from "react";
import {
  Box,
  Fade,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Skeleton,
  Typography,
} from "@mui/material";
import QRCode from "qrcode.react";
import "animate.css";

export const ImageItem = (props) => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);

  const breakpoint = 620;

  React.useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
  }, []);

  return (
    <ImageListItem className={props.className}>
      {props.children}

      {props.artist || props.date ? (
        <ImageListItemBar
          position="top"
          title={
            <Typography style={{ whiteSpace: "initial" }} variant="caption">
              {`${props.artist ?? ""} ${
                props.artist && props.date ? "-" : ""
              } ${props.date ?? ""}`}
            </Typography>
          }
        />
      ) : null}

      {props.title ||
        (props.url && (
          <ImageListItemBar
            position="bottom"
            actionIcon={
              props.url && (
                <QRCode
                  renderAs="svg"
                  size={50}
                  value={props.url}
                  includeMargin
                />
              )
            }
            title={
              <Typography style={{ whiteSpace: "initial" }} variant="caption">
                {props.title}
              </Typography>
            }
          />
        ))}
      {props.title || props.url ? (
        <ImageListItemBar
          position="bottom"
          actionIcon={
            props.url && (
              <QRCode
                style={{ marginLeft: "4px" }}
                renderAs="svg"
                size={80}
                value={props.url}
                includeMargin
              />
            )
          }
          title={
            <Typography style={{ whiteSpace: "initial" }} variant="caption">
              {props.title}
            </Typography>
          }
        />
      ) : null}
      {props.subTitle && (
        <ImageListItemBar
          position="below"
          title={
            <Typography style={{ whiteSpace: "initial" }} variant="caption">
              {props.subcaption}
            </Typography>
          }
        />
      )}
    </ImageListItem>
  );
};
