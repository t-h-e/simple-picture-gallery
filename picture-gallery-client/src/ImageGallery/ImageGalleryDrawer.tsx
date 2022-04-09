import Drawer from "@mui/material/Drawer";
import DrawerHeader from "../MuiLayout/DrawerHeader";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import { TreeItem, TreeView } from "@mui/lab";
import { Folders } from "./models";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function getDefaultExpanded(pathname: string): string[] {
  const pathParts = [];
  let curPathName = pathname.substring(0, pathname.lastIndexOf("/"));
  while (curPathName.length > 0) {
    pathParts.push(curPathName);
    curPathName = curPathName.substring(0, curPathName.lastIndexOf("/"));
  }
  return pathParts;
}

function generateTreeViewChildren(
  folders: Folders[],
  navigateAndToggleExpand: (path: string, navigationAllowed: boolean) => void
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
              nodeId={f.fullPath}
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
            nodeId={f.fullPath}
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

function GenerateTreeView({ root }: { root: Folders }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string[]>(
    getDefaultExpanded(location.pathname)
  );

  const toggleExpanded = (path: string) => {
    if (expanded.includes(path)) {
      setExpanded(expanded.filter((p) => p !== path));
    } else {
      setExpanded([path, ...expanded]);
    }
  };

  const navigateAndToggleExpand = (
    path: string,
    navigationAllowed: boolean
  ) => {
    if (!navigationAllowed || location.pathname === path) {
      toggleExpanded(path);
      return;
    }
    toggleExpanded(path);
    navigate(path);
  };

  return (
    <TreeView
      disableSelection={true}
      defaultCollapseIcon={<FolderOpenIcon />}
      defaultExpandIcon={<FolderIcon />}
      expanded={expanded}
    >
      <TreeItem
        key={root.fullPath}
        nodeId={root.fullPath}
        label={`${root.name} - (${root.numberOfFiles})`}
        onClick={() => navigate(root.fullPath)}
      />
      {root.children.length > 0 ? (
        generateTreeViewChildren(root.children, navigateAndToggleExpand)
      ) : (
        <></>
      )}
    </TreeView>
  );
}

function ImageGalleryDrawer({
  open,
  drawerWidth,
  folder,
  onDrawerCloseClick,
}: {
  open: boolean;
  drawerWidth: number;
  folder: Folders;
  onDrawerCloseClick: () => void;
}) {
  const theme = useTheme();
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={onDrawerCloseClick}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <GenerateTreeView root={folder} />
    </Drawer>
  );
}

export default ImageGalleryDrawer;
