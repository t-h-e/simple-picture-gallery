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
    <>
      <ImageList cols={columns} gap={8} style={{ overflowY: "initial" }}>
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
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  clipPath: "url(#folderPath)",
                }}
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
      {/* External svg does not seem to work (anymore?) */}
      {/* see for example https://codepen.io/imohkay/pen/GJpxXY */}
      <svg
        height={0}
        width={0}
        // Make sure svg does not take up any space
        style={{ position: "absolute" }}
      >
        <defs>
          <clipPath id="folderPath" clipPathUnits="objectBoundingBox">
            {/* Taken from MUI Folder Icon*/}
            <path
              transform="translate(-0.1 -0.25) scale(0.05 0.0625)"
              d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8z"
            ></path>
          </clipPath>
        </defs>
      </svg>
    </>
  );
};
