export function makeImagePath(id: string, format?: string) {
  if (id === null) return "noExist";
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}
