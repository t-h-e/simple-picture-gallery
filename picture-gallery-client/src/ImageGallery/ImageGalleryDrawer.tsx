import Drawer from "@mui/material/Drawer";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import PhotoOutlined from "@mui/icons-material/PhotoOutlined";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useMemo, useState } from "react";
import { Folders } from "./models";
import Toolbar from "@mui/material/Toolbar";
import { Chip, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { smallScreenMediaQuery } from "../ImageGalleryLayout";
import { getDefaultExpanded } from "./PathToExpaned";
import Typography from "@mui/material/Typography";

function generateTreeViewChildren(
  folders: Folders[],
  navigateAndToggleExpand: (_path: string, _navigationAllowed: boolean) => void,
) {
  return (
    <>
      {folders.map((f) => {
        const label =
          f.numberOfFiles === 0 ? (
            f.name
          ) : (
            <>
              {f.name} <Chip label={f.numberOfFiles} size="small" />
            </>
          );
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

const calcFolderWithItem = (
  cur: Folders,
  calculated: Set<string>,
): Set<string> => {
  if (cur.numberOfFiles > 0 || cur.children.length == 0) {
    calculated.add(cur.fullPath);
  }
  cur.children.forEach((a) => calcFolderWithItem(a, calculated));
  return calculated;
};

const GenerateTreeView = ({ root }: { root: Folders }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const folderFullPathContainingPhotos = useMemo(
    () => calcFolderWithItem(root, new Set()),
    [root],
  );
  const [expandedItems, setExpandedItems] = useState<string[]>(
    getDefaultExpanded(location.pathname),
  );
  const [selectedItem, setSelectedItem] = useState<string>(location.pathname);

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
      slots={{
        collapseIcon: FolderOpenIcon,
        expandIcon: FolderIcon,
        endIcon: PhotoOutlined,
      }}
      expandedItems={expandedItems}
      selectedItems={selectedItem}
      onSelectedItemsChange={(event, itemId) => {
        if (itemId != null && folderFullPathContainingPhotos.has(itemId)) {
          setSelectedItem(itemId);
        }
      }}
    >
      <TreeItem
        key={root.fullPath}
        itemId={root.fullPath}
        label={
          <>
            {root.name} <Chip label={root.numberOfFiles} size="small" />
          </>
        }
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
  folders: Folders | undefined;
  handleDrawerToggle: () => void;
}) => {
  const theme = useTheme();
  const smallScreen = !useMediaQuery(smallScreenMediaQuery);

  const drawerContent =
    folders != undefined ? (
      <>
        <Toolbar sx={{ marginBottom: 3 }} />
        <GenerateTreeView root={folders} />
      </>
    ) : (
      <>
        <Toolbar sx={{ marginBottom: 3 }} />
        <Typography sx={{ marginLeft: 2 }}>Loading folders...</Typography>
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
