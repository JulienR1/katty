export const isUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

export const isPlaylist = (url: string) => {
  return url.includes("playlist");
};
