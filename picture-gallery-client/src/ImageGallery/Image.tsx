import { PhotoProps, RenderPhoto } from "react-photo-album";
import React from "react";
import { Backdrop } from "@mui/material";

export const Image: RenderPhoto = ({
  imageProps: { alt, style, ...rest },
}: PhotoProps): JSX.Element => {
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
        onClick={handleToggle}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <img alt={alt} {...rest} />
      </Backdrop>
    </>
  );
};
