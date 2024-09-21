import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import { API_BASE_URL, CDN_BASE_URL } from "@/main";
import type { FileData } from "@/types";
import { Button } from "./components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatExpiresIn,
  formatFileSize,
  formatTimeAgo
} from "@/lib/formaters";
import {
  LoaderCircleIcon,
  FileIcon,
  SquareArrowOutUpRightIcon,
  ClipboardIcon
} from "lucide-react";
import { toast } from "sonner";

export default function FilePage() {
  const { id } = useParams<{ id: string }>();
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [cachedFileBuffer, setCachedFileBuffer] = useState<ArrayBuffer | null>(
    null
  );

  const fetchFileData = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`${API_BASE_URL}/info/${id}`);
      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}`);
      }
      const data = await response.json();
      setFileData(data);
    } catch (error) {
      console.error("Error fetching file data:", error);
      setFileData(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchFileData();
  }, [fetchFileData]);

  const downloadFile = useCallback(async () => {
    if (!id || !fileData) return;

    setIsDownloading(true);
    try {
      let fileBuffer = cachedFileBuffer;
      if (!fileBuffer) {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        fileBuffer = await response.arrayBuffer();
        setCachedFileBuffer(fileBuffer);
      }
      const blob = new Blob([fileBuffer], { type: fileData.type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileData.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsDownloading(false);
    }
  }, [id, fileData, cachedFileBuffer]);

  const copyToClipboard = useCallback((url: string) => {
    navigator.clipboard.writeText(url).then(
      () => {
        toast.success("URL copied to clipboard!");
      },
      () => {
        toast.error("Failed to copy URL");
      }
    );
  }, []);

  if (isLoading) {
    return <Skeleton className="h-[260px] w-full rounded-lg md:w-[600px]" />;
  }

  if (!fileData) {
    return (
      <p className="w-full rounded-lg border p-6 text-center shadow-sm">
        This file does not exist
      </p>
    );
  }

  return (
    <>
      <section className="mx-auto w-full max-w-2xl space-y-3">
        <div className="rounded-lg border p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <FileIcon className="h-12 w-12" />
              <h2 className="max-w-[250px] truncate font-semibold text-primary sm:max-w-full md:text-2xl">
                {fileData.name}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: "Type", value: fileData.type },
                { label: "Size", value: formatFileSize(fileData.size) },
                { label: "Created", value: formatTimeAgo(fileData.created_at) },
                {
                  label: "Expires",
                  value: formatExpiresIn(fileData.expires_at)
                }
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-medium">{label}</p>
                  <p className="text-primary">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <Button
            onClick={downloadFile}
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
        </div>
      </section>
      <div className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded border p-2 text-center">
        <Button
          onClick={() => copyToClipboard(`${CDN_BASE_URL}/${fileData.id}`)}
          variant="ghost"
        >
          <ClipboardIcon className="h-6 w-6 text-gray-400" />
        </Button>
        <a
          href={`${CDN_BASE_URL}/${fileData.id}`}
          target="_blank"
          rel="noreferrer"
          className="mx-auto flex w-full max-w-2xl items-center gap-2 rounded border p-2 text-center"
        >
          <SquareArrowOutUpRightIcon className="h-9 w-9 text-gray-400" />
          <span className="max-w-[250px] truncate sm:max-w-full">
            {`${CDN_BASE_URL}/${fileData.id}`}
          </span>
        </a>
      </div>
    </>
  );
}
