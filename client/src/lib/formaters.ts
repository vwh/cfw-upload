import { formatDistanceToNow, formatRelative } from "date-fns";

export const formatFileSize = (bytes: number) => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

export const formatTimeAgo = (timestamp: number) => {
  return formatDistanceToNow(timestamp, { addSuffix: true });
};

export const formatExpiresIn = (timestamp: number) => {
  return formatRelative(timestamp, new Date());
};
