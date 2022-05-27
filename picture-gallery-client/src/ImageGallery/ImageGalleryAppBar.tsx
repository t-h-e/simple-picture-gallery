import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import env from "../env";
import AppBar from "@mui/material/AppBar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { smallScreenMediaQuery } from "../ImageGalleryLayout";

export const ImageGalleryAppBar = ({
  open,
  onDrawerOpenClick,
}: {
  open: boolean;
  onDrawerOpenClick: () => void;
}) => {
  const smallScreen = !useMediaQuery(smallScreenMediaQuery);
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      style={{ backgroundColor: env.REACT_APP_APPBAR_COLOR ?? "#1976D2" }}
    >
      <Toolbar>
        {smallScreen && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onDrawerOpenClick}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open && smallScreen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        )}
        <Typography variant="h6" noWrap component="div">
          {env.REACT_APP_TITLE ?? "Simple Picture Gallery"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
