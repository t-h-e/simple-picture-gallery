import Drawer from "@mui/material/Drawer";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Folders } from "./models";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { smallScreenMediaQuery } from "../ImageGalleryLayout";
import { getDefaultExpanded } from "./PathToExpaned";

function generateTreeViewChildren(
  folders: Folders[],
  navigateAndToggleExpand: (_path: string, _navigationAllowed: boolean) => void,
) {
  return (
    <>
      {folders.map((f) => {
        const label =
          f.numberOfFiles === 0 ? f.name : `${f.name} - (${f.numberOfFiles})`;
        const containsImages = f.numberOfFiles > 0;
        if (f.children.length === 0) {
          return (
            <TreeItem
              key={f.fullPath}
              itemId={f.fullPath}
              label={label}
              onClick={() =>
                navigateAndToggleExpand(f.fullPath, containsImages)
              }
            />
          );
        }
        return (
          <TreeItem
            key={f.fullPath}
            itemId={f.fullPath}
            label={label}
            onClick={() => navigateAndToggleExpand(f.fullPath, containsImages)}
          >
            {generateTreeViewChildren(f.children, navigateAndToggleExpand)}
          </TreeItem>
        );
      })}
    </>
  );
}

const GenerateTreeView = ({ root }: { root: Folders }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>(
    getDefaultExpanded(location.pathname),
  );

  const toggleExpanded = (path: string) => {
    if (expandedItems.includes(path)) {
      setExpandedItems(expandedItems.filter((p) => p !== path));
    } else {
      setExpandedItems([path, ...expandedItems]);
    }
  };

  const navigateAndToggleExpand = (
    path: string,
    navigationAllowed: boolean,
  ) => {
    if (!navigationAllowed || location.pathname === path) {
      toggleExpanded(path);
      return;
    }
    toggleExpanded(path);
    navigate(path);
  };

  return (
    <SimpleTreeView
      disableSelection
      slots={{ collapseIcon: FolderOpenIcon, expandIcon: FolderIcon }}
      expandedItems={expandedItems}
    >
      <TreeItem
        key={root.fullPath}
        itemId={root.fullPath}
        label={`${root.name} - (${root.numberOfFiles})`}
        onClick={() => navigate(root.fullPath)}
      />
      {root.children.length > 0 ? (
        generateTreeViewChildren(root.children, navigateAndToggleExpand)
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <></>
      )}
    </SimpleTreeView>
  );
};

export const ImageGalleryDrawer = ({
  open,
  drawerWidth,
  folders,
  handleDrawerToggle,
}: {
  open: boolean;
  drawerWidth: number;
  folders: Folders;
  handleDrawerToggle: () => void;
}) => {
  const theme = useTheme();
  const smallScreen = !useMediaQuery(smallScreenMediaQuery);

  const drawerContent = (
    <>
      <Toolbar sx={{ marginBottom: 3 }} />
      <GenerateTreeView root={folders} />
    </>
  );

  return smallScreen ? (
    <Drawer
      variant="temporary"
      anchor={theme.direction === "rtl" ? "right" : "left"}
      open={open}
      onClose={handleDrawerToggle}
      style={{ width: drawerWidth }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      {drawerContent}
    </Drawer>
  ) : (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
