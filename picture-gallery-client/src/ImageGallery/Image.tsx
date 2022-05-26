import { PhotoProps } from "react-photo-album";
import React from "react";
import { Backdrop } from "@mui/material";
import { ImageWithThumbnail } from "./models";
import { Spinner } from "./Spinner";

export const Image = <T extends ImageWithThumbnail>({
  imageProps: { alt, style, src: _useSrcAndThumbnailFromPhoto, ...rest },
  photo,
}: PhotoProps<T>): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };
  const handleImageLoaded = () => {
    setLoaded(true);
  };

  return (
    <>
      <img
        alt={alt}
        style={{
          ...style,
        }}
        {...rest}
        src={photo.thumbnail}
        onClick={handleToggle}
      />
      {open && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          {!loaded && <Spinner />}
          <img
            alt={alt}
            style={{
              maxHeight: "90%",
              maxWidth: "90%",
            }}
            {...rest}
            src={photo.src}
            onLoad={handleImageLoaded}
          />
        </Backdrop>
      )}
    </>
  );
};
