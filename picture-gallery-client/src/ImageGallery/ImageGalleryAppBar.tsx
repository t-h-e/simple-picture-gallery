import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import React from "react";
import AppBar from "../MuiLayout/AppBar";

function ImageGalleryAppBar({
  open,
  drawerWidth,
  onDrawerOpenClick,
}: {
  open: boolean;
  drawerWidth: number;
  onDrawerOpenClick: () => void;
}) {
  return (
    <AppBar position="fixed" open={open} drawerwidth={drawerWidth}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onDrawerOpenClick}
          edge="start"
          sx={{ mr: 2, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {process.env.REACT_APP_TITLE ?? "Simple Picture Gallery"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default ImageGalleryAppBar;
