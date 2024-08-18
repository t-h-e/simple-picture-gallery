import React from "react";
import { FolderPreview } from "./models";
import { useColumns } from "../util/responsive";
import {
  Chip,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import { Link } from "react-router-dom";

export const FolderGallery = ({ folders }: { folders: FolderPreview[] }) => {
  const columns = useColumns();

  return (
    <ImageList cols={columns} gap={8}>
      {folders.map((folder) => (
        <ImageListItem key={folder.fullPath}>
          {/* Link and image styling taken from https://github.com/mui/material-ui/issues/22597 */}
          <Link
            to={folder.fullPath}
            style={{ display: "block", height: "100%" }}
          >
            <img
              src={folder.imagePreviewSrc}
              alt={folder.name}
              loading="lazy"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
            <ImageListItemBar
              title={folder.name}
              actionIcon={
                <Chip
                  label={folder.numberOfFiles}
                  size="small"
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.24);",
                    marginRight: 1,
                  }}
                />
              }
            />
          </Link>
        </ImageListItem>
      ))}
    </ImageList>
  );
};
