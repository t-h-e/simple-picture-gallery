import Drawer from "@mui/material/Drawer";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import PhotoOutlined from "@mui/icons-material/PhotoOutlined";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Folders } from "./models";
import Toolbar from "@mui/material/Toolbar";
import { Chip, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { smallScreenMediaQuery } from "../ImageGalleryLayout";
import { getDefaultExpanded } from "./PathToExpaned";
import Typography from "@mui/material/Typography";

function generateTreeViewChildren(
  folders: Folders[],
  navigateAndToggleExpand: (_path: string) => void,
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
        if (f.children.length === 0) {
          return (
            <TreeItem
              key={f.fullPath}
              itemId={f.fullPath}
              label={label}
              onClick={() => navigateAndToggleExpand(f.fullPath)}
            />
          );
        }
        return (
          <TreeItem
            key={f.fullPath}
            itemId={f.fullPath}
            label={label}
            onClick={() => navigateAndToggleExpand(f.fullPath)}
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
  const [selectedItem, setSelectedItem] = useState<string>(location.pathname);

  // TODO: clean this effect up. See also `getDefaultExpanded`
  useEffect(() => {
    let curPathname = location.pathname.startsWith("/")
      ? location.pathname.slice(1)
      : location.pathname;
    while (curPathname.endsWith("/")) {
      curPathname = curPathname.slice(0, -1);
    }
    const parentPathname = curPathname.substring(
      0,
      curPathname.lastIndexOf("/"),
    );
    if (!expandedItems.includes(parentPathname)) {
      setExpandedItems([parentPathname, ...expandedItems]);
    }
    setSelectedItem(curPathname);
  }, [location]);

  const toggleExpanded = (path: string) => {
    if (expandedItems.includes(path)) {
      setExpandedItems(expandedItems.filter((p) => p !== path));
    } else {
      setExpandedItems([path, ...expandedItems]);
    }
  };

  const navigateAndToggleExpand = (path: string) => {
    toggleExpanded(path);
    if (location.pathname !== path) {
      navigate(path);
    }
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
        if (itemId != null) {
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
