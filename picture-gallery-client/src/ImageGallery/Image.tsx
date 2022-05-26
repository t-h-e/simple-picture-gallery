import { PhotoProps } from "react-photo-album";
import React from "react";
import { Backdrop } from "@mui/material";
import { ImageWithThumbnail } from "./models";

export const Image = <T extends ImageWithThumbnail>({
  imageProps: { alt, style, src: _useSrcAndThumbnailFromPhoto, ...rest },
  photo,
}: PhotoProps<T>): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <img alt={alt} {...rest} src={photo.src} />
      </Backdrop>
    </>
  );
};
