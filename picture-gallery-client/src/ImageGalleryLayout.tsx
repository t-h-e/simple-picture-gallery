import React, { useEffect, useState } from "react";
import { Photo } from "react-photo-album";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { Folders } from "./ImageGallery/models";
import ImageGalleryAppBar from "./ImageGallery/ImageGalleryAppBar";
import DrawerHeader from "./MuiLayout/DrawerHeader";
import ImageGalleryDrawer from "./ImageGallery/ImageGalleryDrawer";
import ImageGallery from "./ImageGallery/ImageGallery";
import Main from "./MuiLayout/Main";
import env from "./env";

const drawerWidth = 240;

function ImageGalleryLayout() {
  const [open, setOpen] = useState(true);
  const [error, setError] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [images, setImages] = useState<Photo[]>([]);
  const [folders, setFolders] = useState<Folders>({
    name: "Home",
    fullPath: "/",
    numberOfFiles: 0,
    children: [],
  });

  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
        open={open}
        drawerWidth={drawerWidth}
        onDrawerOpenClick={handleDrawerOpen}
      />
      <ImageGalleryDrawer
        open={open}
        drawerWidth={drawerWidth}
        folder={folders}
        onDrawerCloseClick={handleDrawerClose}
      />
      <Main open={open} drawerwidth={drawerWidth}>
        <DrawerHeader />
        {imagesLoaded ? (
          <ImageGallery images={images} />
        ) : (
          <CircularProgress
            style={{ color: env.REACT_APP_APPBAR_COLOR ?? "#1976D2" }}
          />
        )}
      </Main>
    </Box>
  );
}

export default ImageGalleryLayout;
