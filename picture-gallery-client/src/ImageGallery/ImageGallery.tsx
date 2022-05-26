import PhotoAlbum from "react-photo-album";
import React from "react";
import { Image } from "./Image";
import { ImageWithThumbnail } from "./models";

function ImageGallery({ images }: { images: ImageWithThumbnail[] }) {
  //  For all kind of settings see:
  // https://react-photo-album.com/examples/playground
  // https://codesandbox.io/s/github/igordanchenko/react-photo-album/tree/main/examples/playground

  return images.length === 0 ? (
    <p>
      No images available. You may want to add images in your root directory.
    </p>
  ) : (
    <PhotoAlbum layout="masonry" photos={images} renderPhoto={Image} />
  );
}

export default ImageGallery;
