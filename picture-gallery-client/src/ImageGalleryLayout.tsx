import React, { useEffect, useState } from "react";
import { Photo } from "react-photo-album";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useLocation } from "react-router-dom";
import { Folders } from "./ImageGallery/models";
import ImageGalleryAppBar from "./ImageGallery/ImageGalleryAppBar";
import DrawerHeader from "./MuiLayout/DrawerHeader";
import ImageGalleryDrawer from "./ImageGallery/ImageGalleryDrawer";
import ImageGallery from "./ImageGallery/ImageGallery";
import Main from "./MuiLayout/Main";

const drawerWidth = 240;

function ImageGalleryLayout() {
  const [open, setOpen] = useState(true);
  const [folders, setFolders] = useState<Folders>({
    name: "Home",
    fullPath: "/",
    numberOfFiles: 0,
    children: [],
  });
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [images, setImages] = useState<Photo[]>([]);

  useEffect(() => {
    fetch(`/api/${location.pathname}`)
      .then((res) => res.json())
      .then((data) => setImages(data.images));
  }, [location.pathname]);

  useEffect(() => {
    fetch("/directories")
      .then((res) => res.json())
      .then((data) => setFolders(data));
  }, []);

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
        <ImageGallery images={images} />
      </Main>
    </Box>
  );
}

export default ImageGalleryLayout;
