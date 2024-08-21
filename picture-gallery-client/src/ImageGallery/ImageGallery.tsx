import React, { useState } from "react";
import { ImageWithThumbnail } from "./models";

import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";

export const ImageGallery = ({ images }: { images: ImageWithThumbnail[] }) => {
  const [index, setIndex] = useState(-1);

  return (
    <>
      <MasonryPhotoAlbum
        photos={images}
        render={{
          image: (props, context) => (
            <img loading={"lazy"} {...props} src={context.photo.thumbnail} />
          ),
        }}
        onClick={({ index }) => setIndex(index)}
      />
      <Lightbox
        slides={images}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        controller={{ closeOnBackdropClick: true }}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
        thumbnails={{ vignette: false }}
        styles={{
          root: {
            "--yarl__color_backdrop": "rgba(0, 0, 0, 0.85)",
          },
        }}
      />
    </>
  );
};
