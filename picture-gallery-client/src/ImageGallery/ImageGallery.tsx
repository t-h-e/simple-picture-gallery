import React, { useState } from "react";
import { ImageWithThumbnail } from "./models";
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { ImageList, ImageListItem } from "@mui/material";

function ImageGallery({ images }: { images: ImageWithThumbnail[] }) {
  const [index, setIndex] = useState(-1);

  if (images.length === 0) {
    return (
      <p>
        No images available. You may want to add images in your root directory.
      </p>
    );
  }

  return (
    <>
      <ImageList variant="masonry" cols={3} gap={8}>
        {images.map((item, index) => (
          <ImageListItem key={item.thumbnail}>
            <img
              src={item.thumbnail}
              loading="lazy"
              onClick={() => setIndex(index)}
            />
          </ImageListItem>
        ))}
      </ImageList>
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
}

export default ImageGallery;
