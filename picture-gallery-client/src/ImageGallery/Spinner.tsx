import env from "../env";
import { CircularProgress } from "@mui/material";
import React from "react";

export const Spinner = (): JSX.Element => {
  return (
    <CircularProgress
      style={{ color: env.REACT_APP_APPBAR_COLOR ?? "#1976D2" }}
      size={100}
    />
  );
};
