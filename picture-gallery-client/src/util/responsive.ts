import useMediaQuery from "@mui/material/useMediaQuery";

const breakpoints = Object.freeze([1200, 600, 300, 0]);

export function useColumns(): number {
  const values = [5, 4, 3, 2];
  const index = breakpoints
    .map((b) => useMediaQuery(`(min-width:${b}px)`))
    .findIndex((a) => a);
  return Math.max(values[Math.max(index, 0)], 1);
}
