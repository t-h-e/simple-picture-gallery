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
import { useColumns } from "../util/responsive";

export const ImageGallery = ({ images }: { images: ImageWithThumbnail[] }) => {
  const [index, setIndex] = useState(-1);
  const columns = useColumns();

  return (
    <>
      <ImageList variant="masonry" cols={columns} gap={8}>
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
};
