import { useCallback, useState, useMemo, useEffect } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";

import { API_BASE_URL } from "@/main";
import { toast } from "sonner";
import {
  UploadIcon,
  SquareArrowOutUpRightIcon,
  LoaderCircleIcon
} from "lucide-react";

import type { UploadedFile, UploadResponse } from "@/types";

const MAX_FILES = 6;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }

  return response.json();
}

export default function UploadDropzone() {
  const [currentURL, setCurrentURL] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    setCurrentURL(window.location.href);
  }, []);

  const handleFileUpload = useCallback(async (uploadedFile: UploadedFile) => {
    try {
      const response = await uploadFile(uploadedFile.file);
      setUploadedFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.file.name === uploadedFile.file.name
            ? { ...f, response, isUploading: false }
            : f
        )
      );
      toast.success(`${uploadedFile.file.name} uploaded successfully`);
    } catch (error) {
      setUploadedFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.file.name === uploadedFile.file.name
            ? { ...f, isUploading: false }
            : f
        )
      );
      toast.error(`Failed to upload ${uploadedFile.file.name}`);
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (uploadedFiles.length + acceptedFiles.length > MAX_FILES) {
        toast.error(`You can only upload a maximum of ${MAX_FILES} files.`);
        return;
      }
      for (const rejection of fileRejections) {
        for (const error of rejection.errors) {
          toast.error(error.message);
        }
      }
      if (fileRejections.length > 0) return;
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isUploading: true
      }));
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      newFiles.forEach(handleFileUpload);
    },
    [uploadedFiles, handleFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES,
    validator: () =>
      uploadedFiles.length >= MAX_FILES
        ? {
            code: "too-many-files",
            message: `You can only upload a maximum of ${MAX_FILES} files.`
          }
        : null
  });

  const dropzoneClass = useMemo(
    () => `
    flex w-full transform cursor-pointer flex-col items-center justify-center
    rounded-lg border-2 border-dashed p-6 py-12 transition-colors duration-300 ease-in-out
    ${
      isDragActive
        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
        : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
    }
  `,
    [isDragActive]
  );

  const FileStatus = ({ uploadedFile }: { uploadedFile: UploadedFile }) => {
    if (uploadedFile.isUploading) {
      return (
        <LoaderCircleIcon className="h-full w-full animate-spin text-gray-400" />
      );
    }
    return (
      <a
        href={uploadedFile.response ? `/${uploadedFile.response.fileId}` : "#"}
        target="_blank"
        rel="noreferrer"
      >
        <SquareArrowOutUpRightIcon className="h-9 w-9 text-gray-400" />
      </a>
    );
  };

  return (
    <section className="mx-auto w-full space-y-3">
      <div {...getRootProps()} className={dropzoneClass}>
        <input {...getInputProps()} />
        <UploadIcon className="h-10 w-10 text-gray-400" />
        <p className="text-md mt-2 text-gray-500">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Max {MAX_FILES} files, up to 100 MB each
        </p>
      </div>
      {uploadedFiles.length > 0 && (
        <div className="flex flex-col gap-3">
          {uploadedFiles.map((uploadedFile, index) => (
            <div
              key={`${uploadedFile.file.name}-${index}`}
              className="relative flex items-center gap-1 rounded-lg border p-2 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
            >
              <div className="relative h-9 w-9">
                {<FileStatus uploadedFile={uploadedFile} />}
              </div>
              <div className="flex flex-grow flex-col">
                <p className="w-full max-w-[230px] truncate text-xs sm:max-w-full">
                  {uploadedFile.file.name}
                </p>
                {uploadedFile.isUploading ? (
                  <p className="text-gray-500">Uploading</p>
                ) : uploadedFile.response ? (
                  <a
                    href={`${currentURL}${uploadedFile.response.fileId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-xs text-primary hover:underline"
                  >
                    {currentURL}
                    {uploadedFile.response.fileId}
                  </a>
                ) : (
                  <p className="text-xs text-gray-500">Upload failed</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
