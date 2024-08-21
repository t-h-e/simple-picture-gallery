const cleanupPath = (pathname: string): string => {
  let curPathname = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  while (curPathname.endsWith("/")) {
    curPathname = curPathname.slice(0, -1);
  }
  return curPathname;
};

export const getDefaultExpanded = (pathname: string): string[] => {
  let curPathname = cleanupPath(pathname);
  const pathParts = [];
  while (curPathname.length > 0) {
    pathParts.push(curPathname);
    curPathname = curPathname.substring(0, curPathname.lastIndexOf("/"));
  }
  return pathParts;
};

export const getParentAndChildPath = (
  pathname: string,
): { parent: string; cur: string } => {
  let curPathname = cleanupPath(pathname);
  const parentPathname = curPathname.substring(0, curPathname.lastIndexOf("/"));
  return {
    parent: parentPathname,
    cur: curPathname,
  };
};
