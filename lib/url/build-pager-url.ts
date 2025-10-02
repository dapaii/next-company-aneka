// pure util (aman dipakai server/client)
export function buildPagerUrl(
  pathname: string,
  currentParams: string | null | undefined,
  page: number
) {
  const params = new URLSearchParams(currentParams ?? "");
  params.set("page", String(page)); // keep q/scope/sort/per yang lain
  return `${pathname}?${params.toString()}`;
}
