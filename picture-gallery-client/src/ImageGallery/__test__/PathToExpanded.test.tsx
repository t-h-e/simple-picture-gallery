import { getDefaultExpanded } from "../PathToExpaned";

interface pathWithExpanded {
  pathname: string;
  expanded: string[];
}

describe("getDefaultExpanded", () => {
  const pathsIncludingExpanded: pathWithExpanded[] = [
    { pathname: "", expanded: [] },
    { pathname: "/bla", expanded: ["bla"] },
    { pathname: "/images/bla", expanded: ["images/bla", "images"] },
    {
      pathname: "/above/images/bla",
      expanded: ["above", "above/images", "above/images/bla"],
    },
  ];

  it.each(pathsIncludingExpanded)(
    "should allow valid path: %s",
    ({ pathname, expanded }) => {
      expect(getDefaultExpanded(pathname).sort()).toEqual(expanded.sort());
    }
  );
});
