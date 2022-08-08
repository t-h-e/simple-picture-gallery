import { PhotoProps } from "react-photo-album";
import { ImageWithThumbnail } from "./models";
import React from "react";

export const Image = <T extends ImageWithThumbnail>({
  imageProps: { alt, style, src: _useSrcAndThumbnailFromPhoto, ...rest },
  photo,
}: PhotoProps<T>): JSX.Element => {
  return (
    <>
      <img
        alt={alt}
        style={{
          ...style,
        }}
        {...rest}
        src={photo.thumbnail}
        loading={"lazy"}
      />
    </>
  );
};
