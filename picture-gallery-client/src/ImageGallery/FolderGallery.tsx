import React from "react";
import { FolderPreview, ImageWithThumbnail } from "./models";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";

import { ColumnsPhotoAlbum } from "react-photo-album";
import "react-photo-album/columns.css";

export interface PhotoWithFolder extends ImageWithThumbnail {
  folderPreview: FolderPreview;
}

const PreviewFolder = ({ folder }: { folder: FolderPreview }) => {
  return (
    <img
      loading="lazy"
      src={folder.imagePreview.thumbnail}
      alt={folder.name}
      style={{
        objectFit: "cover",
        width: "100%",
        height: "100%",
        clipPath: "url(#folderPath)",
      }}
    />
  );
};

export const FolderGallery = ({ folders }: { folders: FolderPreview[] }) => {
  // hard
  const foldersAsImages: PhotoWithFolder[] = folders.map((f) => ({
    ...f.imagePreview,
    href: f.fullPath,
    folderPreview: f,
    // hardcode width and height, so that the aspect ratio looks good for a folder icon
    // the image is put in place with `object-fit: "cover"`
    width: 290,
    height: 230,
  }));

  return (
    <>
      <ColumnsPhotoAlbum
        photos={foldersAsImages}
        render={{
          image: (props, context) => (
            <PreviewFolder folder={context.photo.folderPreview} />
          ),
          link: (props, context) => {
            return (
              <Link
                to={context.photo.href!}
                {...props}
                style={{
                  // TODO: how to fix `react/prop-types`
                  // eslint-disable-next-line react/prop-types
                  ...props.style,
                  height: context.height,
                }}
              />
            );
          },
          extras: (props, context) => (
            <div
              style={{
                width: "100%",
                color: "#fff",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                padding: "10px 0px 10px 0px",
                pointerEvents: "none",
              }}
            >
              <Typography noWrap style={{ textAlign: "center" }}>
                {context.photo.folderPreview.name}
              </Typography>
            </div>
          ),
        }}
      />
      {/* External SVG is not supported, except in Firefox. See https://caniuse.com/css-clip-path */}
      {/* See for example https://codepen.io/imohkay/pen/GJpxXY */}
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
