import { Photo } from "react-photo-album";

export interface Folders {
  name: string;
  fullPath: string;
  numberOfFiles: number;
  children: Folders[];
}

export interface FolderPreview {
  name: string;
  fullPath: string;
  imagePreview: ImageWithThumbnail;
}

export interface ImageWithThumbnail extends Photo {
  thumbnail: string;
}
