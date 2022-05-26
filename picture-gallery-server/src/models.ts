export interface Image {
  src: string;
  thumbnail: string;
  width: number;
  height: number;
}

export interface Folder {
  images: Image[];
}

export interface Folders {
  name: string;
  fullPath: string;
  numberOfFiles: number;
  children: Folders[];
}

export const a = <T>(v: T): T => {
  return v;
};
