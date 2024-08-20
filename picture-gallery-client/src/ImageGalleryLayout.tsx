import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FolderPreview,
  Folders,
  ImageWithThumbnail,
} from "./ImageGallery/models";
import { ImageGalleryAppBar } from "./ImageGallery/ImageGalleryAppBar";
import { ImageGalleryDrawer } from "./ImageGallery/ImageGalleryDrawer";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { Spinner } from "./ImageGallery/Spinner";
import Toolbar from "@mui/material/Toolbar";
import { Chip, Divider } from "@mui/material";
import { FolderGallery } from "./ImageGallery/FolderGallery";

const drawerWidth = 240;
export const smallScreenMediaQuery = `(min-width:${drawerWidth * 3}px)`;

function ImageGalleryLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [images, setImages] = useState<ImageWithThumbnail[]>([]);

  const [folders, setFolders] = useState<Folders | undefined>(undefined);
  const [foldersPreview, setFoldersPreview] = useState<
    FolderPreview[] | undefined
  >([]);
  const location = useLocation();
  const navigate = useNavigate();

  function handleDrawerToggle() {
    setDrawerOpen(!drawerOpen);
  }

  useEffect(() => {
    setFoldersPreview(undefined);
    setImages([]);
    setError(false);
    setImagesLoaded(false);
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
    fetch(`/folderspreview${location.pathname}`, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFoldersPreview(data);
      });
  }, [location.pathname]);

  useEffect(() => {
    fetch("/directories", {
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setFolders(data));
  }, []);

  if (error) {
    return (
      <p>
        Unrecoverable error: Request for pictures failed. Please contact the
        administrator.
      </p>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ImageGalleryAppBar
        open={drawerOpen}
        onDrawerOpenClick={handleDrawerToggle}
      />
      <ImageGalleryDrawer
        open={drawerOpen}
        drawerWidth={drawerWidth}
        folders={folders}
        handleDrawerToggle={handleDrawerToggle}
      />
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
              <Divider style={{ marginBottom: "10px" }}>
                <Chip label="Images" size="small" />
              </Divider>
            )}
            {images.length > 0 && <ImageGallery images={images} />}
            {images.length == 0 && foldersPreview.length == 0 && (
              <p>
                No images available. You may want to add images to this
                directory.
              </p>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default ImageGalleryLayout;
