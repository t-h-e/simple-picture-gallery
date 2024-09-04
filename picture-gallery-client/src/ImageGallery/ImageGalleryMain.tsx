import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useLocation, useNavigate } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import { Chip, Divider } from "@mui/material";
import { FolderPreview, ImageWithThumbnail } from "./models";
import { Spinner } from "./Spinner";
import { FolderGallery } from "./FolderGallery";
import { ImageGallery } from "./ImageGallery";

export const ImageGalleryMain = ({
  setError,
}: {
  setError: (_: boolean) => void;
}) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [images, setImages] = useState<ImageWithThumbnail[]>([]);

  const [foldersPreview, setFoldersPreview] = useState<
    FolderPreview[] | undefined
  >([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setFoldersPreview(undefined);
    setImages([]);
    setError(false);
    setImagesLoaded(false);
    fetch(`/folderspreview${location.pathname}`, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFoldersPreview(data);
      });
    fetch(`/images${location.pathname}`, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.images === undefined) {
          if (location.pathname !== "/") {
            navigate("/");
          } else {
            setError(true);
          }
        } else {
          setImages(data.images);
          setImagesLoaded(true);
        }
      });
  }, [location.pathname]);

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      {!imagesLoaded || !foldersPreview ? (
        <Spinner />
      ) : (
        <>
          {foldersPreview.length > 0 && (
            <>
              <Divider style={{ marginBottom: "10px" }}>
                <Chip label="Folders" size="small" />
              </Divider>
              <FolderGallery folders={foldersPreview} />
            </>
          )}
          {images.length > 0 && foldersPreview.length > 0 && (
            <Divider style={{ marginBottom: "10px", marginTop: "10px" }}>
              <Chip label="Images" size="small" />
            </Divider>
          )}
          {images.length > 0 && <ImageGallery images={images} />}
          {images.length == 0 && foldersPreview.length == 0 && (
            <p>
              No images available. You may want to add images to this directory.
            </p>
          )}
        </>
      )}
    </Box>
  );
};
