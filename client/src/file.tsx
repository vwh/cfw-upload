import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDistanceToNow, formatRelative } from "date-fns";
import { Button } from "./components/ui/button";
import { LoaderCircleIcon, FileIcon } from "lucide-react";

type FileData = {
  name: string;
  size: number;
  type: string;
  id: string;
  created_at: number;
  expires_at: number;
};

const formatTimeAgo = (timestamp: number) => {
  return formatDistanceToNow(timestamp, { addSuffix: true });
};

const formatExpiresIn = (timestamp: number) => {
  return formatRelative(timestamp, new Date());
};

export default function FilePage() {
  const { id } = useParams<{ id: string }>();
  const [fileData, setFileData] = useState<FileData>();
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [cachedFileBuffer, setCachedFileBuffer] = useState<ArrayBuffer | null>(
    null
  );

  async function downloadFile(id: string) {
    setIsDownloading(true);
    try {
      let fileBuffer: ArrayBuffer;
      if (!cachedFileBuffer) {
        const response = await fetch(`http://localhost:8787/${id}`);
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        fileBuffer = await response.arrayBuffer();
        setCachedFileBuffer(fileBuffer);
      } else {
        fileBuffer = cachedFileBuffer;
      }
      const blob = new Blob([fileBuffer], { type: fileData?.type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileData?.name || "file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching file data:", error);
    } finally {
      setIsDownloading(false);
    }
  }

  useEffect(() => {
    async function getFileData() {
      try {
        const response = await fetch(`http://localhost:8787/info/${id}`);
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        const data = await response.json();
        setFileData(data);
      } catch (error) {
        console.error("Error fetching file data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      getFileData();
    }
  }, [id]);

  const formatFileSize = (bytes: number) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const handleDownload = () => {
    if (!isDownloading) {
      downloadFile(id!);
    }
  };

  return (
    <section className="mx-auto w-full max-w-2xl space-y-3">
      <div className="rounded-lg border p-6 shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <LoaderCircleIcon className="h-10 w-10 animate-spin text-gray-400" />
          </div>
        ) : fileData ? (
          <>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <FileIcon className="h-12 w-12" />
                <h2 className="max-w-[250px] truncate font-semibold text-primary sm:max-w-full md:text-2xl">
                  {fileData.name}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Type</p>
                  <p className="text-primary">{fileData.type}</p>
                </div>
                <div>
                  <p className="font-medium">Size</p>
                  <p className="text-primary">
                    {formatFileSize(fileData.size)}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-primary">
                    {formatTimeAgo(fileData.created_at)}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Expires</p>
                  <p className="text-primary">
                    {formatExpiresIn(fileData.expires_at)}
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              variant="gooeyLeft"
              className="mt-4 w-full"
            >
              {isDownloading ? (
                <div className="flex items-center gap-2">
                  Downloading
                  <LoaderCircleIcon className="h-5 w-5 animate-spin" />
                </div>
              ) : (
                "Download"
              )}
            </Button>
          </>
        ) : (
          <p className="text-center">This file does not exist</p>
        )}
      </div>
    </section>
  );
}
