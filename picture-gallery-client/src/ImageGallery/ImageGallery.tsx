import PhotoAlbum from "react-photo-album";
import React, { useState } from "react";
import { Image } from "./Image";
import { ImageWithThumbnail } from "./models";
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { Fullscreen } from "yet-another-react-lightbox/plugins/fullscreen";
import { Slideshow } from "yet-another-react-lightbox/plugins/slideshow";
import { Thumbnails } from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "./yarl.thumbnails.override.css";
import { Zoom } from "yet-another-react-lightbox/plugins/zoom";

function ImageGallery({ images }: { images: ImageWithThumbnail[] }) {
  const [index, setIndex] = useState(-1);

  if (images.length === 0) {
    return (
      <p>
        No images available. You may want to add images in your root directory.
      </p>
    );
  }

  //  For all kind of settings see:
  // https://react-photo-album.com/examples/playground
  // https://codesandbox.io/s/github/igordanchenko/react-photo-album/tree/main/examples/playground
  return (
    <>
      <PhotoAlbum
        layout="masonry"
        photos={images}
        renderPhoto={Image}
        onClick={(event, photo, index) => setIndex(index)}
      />
      <Lightbox
        slides={images}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        controller={{ closeOnBackdropClick: true }}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
        styles={{
          root: { "--yarl__color_backdrop": "rgba(0, 0, 0, 0.85)" } as any,
        }}
      />
    </>
  );
}

export default ImageGallery;
