export const getDefaultExpanded = (pathname: string): string[] => {
  const pathParts = [];
  let curPathname = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  while (curPathname.endsWith("/")) {
    curPathname = curPathname.slice(0, -1);
  }
  while (curPathname.length > 0) {
    pathParts.push(curPathname);
    curPathname = curPathname.substring(0, curPathname.lastIndexOf("/"));
  }
  return pathParts;
};
