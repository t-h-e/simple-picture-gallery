import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import env from "../env";
import AppBar from "@mui/material/AppBar";

export const ImageGalleryAppBar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      style={{ backgroundColor: env.REACT_APP_APPBAR_COLOR ?? "#1976D2" }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          {env.REACT_APP_TITLE ?? "Simple Picture Gallery"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
