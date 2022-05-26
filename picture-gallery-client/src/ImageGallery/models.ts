import { Photo } from "react-photo-album";

export interface Folders {
  name: string;
  fullPath: string;
  numberOfFiles: number;
  children: Folders[];
}

export interface ImageWithThumbnail extends Photo {
  thumbnail: string;
}
