import { CircularProgress } from "@mui/material";
import React from "react";

export const Spinner = (): JSX.Element => {
  return (
    <CircularProgress
      style={{ color: import.meta.env.VITE_APPBAR_COLOR ?? "#1976D2" }}
      size={100}
    />
  );
};
