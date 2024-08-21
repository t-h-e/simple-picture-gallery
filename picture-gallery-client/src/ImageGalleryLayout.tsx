import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { ImageGalleryAppBar } from "./ImageGallery/ImageGalleryAppBar";
import { ImageGalleryDrawer } from "./ImageGallery/ImageGalleryDrawer";
import { ImageGalleryMain } from "./ImageGallery/ImageGalleryMain";

const drawerWidth = 240;
export const smallScreenMediaQuery = `(min-width:${drawerWidth * 3}px)`;

export const ImageGalleryLayout = (): React.JSX.Element => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState(false);

  function handleDrawerToggle() {
    setDrawerOpen(!drawerOpen);
  }

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
        handleDrawerToggle={handleDrawerToggle}
      />
      <ImageGalleryMain setError={setError} />
    </Box>
  );
};
