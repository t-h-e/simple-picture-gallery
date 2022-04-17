import PhotoAlbum, { Photo } from "react-photo-album";
import React from "react";
import { Image } from "./Image";

function ImageGallery({ images }: { images: Photo[] }) {
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
