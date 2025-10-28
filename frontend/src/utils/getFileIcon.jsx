import fileIconsMap from "./fileIconsMap";

export const getFileIconPath = (fileName) => {
  if (!fileName) return "/icons/default.png";
  const ext = fileName.split(".").pop().toLowerCase();
  const iconFile = fileIconsMap[ext] || fileIconsMap["default"];
  return `/icons/${iconFile}`;
};
