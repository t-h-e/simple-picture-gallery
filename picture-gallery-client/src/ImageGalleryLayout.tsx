import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useLocation, useNavigate } from "react-router-dom";
import { Folders, ImageWithThumbnail } from "./ImageGallery/models";
import { ImageGalleryAppBar } from "./ImageGallery/ImageGalleryAppBar";
import { ImageGalleryDrawer } from "./ImageGallery/ImageGalleryDrawer";
import ImageGallery from "./ImageGallery/ImageGallery";
import { Spinner } from "./ImageGallery/Spinner";
import Toolbar from "@mui/material/Toolbar";

const drawerWidth = 240;
export const smallScreenMediaQuery = `(min-width:${drawerWidth * 3}px)`;

function ImageGalleryLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [images, setImages] = useState<ImageWithThumbnail[]>([]);

  const [folders, setFolders] = useState<Folders>({
    name: "Home",
    fullPath: "/",
    numberOfFiles: 0,
    children: [],
  });

  const location = useLocation();
  const navigate = useNavigate();

  function handleDrawerToggle() {
    setDrawerOpen(!drawerOpen);
  }

  useEffect(() => {
    setImages([]);
    setError(false);
    setImagesLoaded(false);
    fetch(`/images${location.pathname}`)
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

  useEffect(() => {
    fetch("/directories")
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
        folder={folders}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {imagesLoaded ? <ImageGallery images={images} /> : <Spinner />}
      </Box>
    </Box>
  );
}

export default ImageGalleryLayout;
