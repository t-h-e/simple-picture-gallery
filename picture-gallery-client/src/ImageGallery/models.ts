import { Slide } from "yet-another-react-lightbox";

export interface Folders {
  name: string;
  fullPath: string;
  numberOfFiles: number;
  children: Folders[];
}

export interface FolderPreview {
  name: string;
  fullPath: string;
  numberOfFiles: number;
  imagePreviewSrc: string | undefined;
}

export interface ImageWithThumbnail extends Slide {
  thumbnail: string;
}
