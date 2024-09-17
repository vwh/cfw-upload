import { useCallback, useState } from "react";

import { useDropzone, type FileRejection } from "react-dropzone";
import { Button } from "./ui/button";
import { toast } from "sonner";

import { UploadIcon, FileIcon, XCircleIcon } from "lucide-react";

interface UploadedFile extends File {
  preview: string;
}

const MAX_FILES = 6;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB in bytes

export default function UploadDropzone() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // Check if adding new files would exceed the limit
      if (uploadedFiles.length + acceptedFiles.length > MAX_FILES) {
        toast.error(`You can only upload a maximum of ${MAX_FILES} files.`);
        return;
      }

      if (fileRejections.length > 0) {
        for (const rejection of fileRejections) {
          for (const error of rejection.errors) {
            toast.error(error.message);
          }
        }
        return;
      }

      setUploadedFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      ]);
    },
    [uploadedFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES,
    validator: (file) => {
      if (uploadedFiles.length >= MAX_FILES) {
        return {
          code: "too-many-files",
          message: `You can only upload a maximum of ${MAX_FILES} files.`
        };
      }
      return null;
    }
  });

  const removeFile = (file: UploadedFile) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((f) => f.name !== file.name)
    );
    URL.revokeObjectURL(file.preview);
  };

  const onUpload = () => {
    console.log("Uploading files:", uploadedFiles);
    // TODO: Upload files
    toast.success("Upload started!");
  };

  return (
    <section className="mx-auto w-full space-y-3">
      <div
        {...getRootProps()}
        className={`flex w-full transform cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 py-12 transition-colors duration-300 ease-in-out ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
        }`}
      >
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
        <>
          <Button
            className="text-md w-full font-bold"
            variant="outline"
            onClick={onUpload}
          >
            Start Uploading
          </Button>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {uploadedFiles.map((file) => (
              <div
                key={file.name}
                className="relative flex flex-col items-center rounded-lg border p-2 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
              >
                <div className="relative h-20 w-20">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-full w-full rounded object-cover"
                    />
                  ) : (
                    <FileIcon className="h-full w-full text-gray-400" />
                  )}
                </div>
                <p className="mt-2 w-full truncate text-xs">{file.name}</p>
                <button
                  type="button"
                  onClick={() => removeFile(file)}
                  className="absolute -right-2 -top-2 rounded-full bg-background"
                >
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
