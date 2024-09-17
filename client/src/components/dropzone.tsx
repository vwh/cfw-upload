import { useCallback, useState } from "react";

import { useDropzone, type FileRejection } from "react-dropzone";
import { Button } from "./ui/button";
import { toast } from "sonner";

import { UploadIcon, FileIcon, XCircleIcon } from "lucide-react";

interface UploadedFile extends File {
  preview: string;
}

export default function UploadDropzone() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
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
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  });

  const removeFile = (file: UploadedFile) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((f) => f.name !== file.name)
    );
    URL.revokeObjectURL(file.preview);
  };

  const onUpload = () => {
    console.log("Uploading files:", uploadedFiles);
    // TOOD: Upload files
    toast.success("Upload started!");
  };

  return (
    <section className="mx-auto w-full space-y-4">
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
        <p className="mt-2 text-sm text-gray-500">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
      </div>
      {uploadedFiles.length > 0 && (
        <>
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
          <Button onClick={onUpload}>Upload Files</Button>
        </>
      )}
    </section>
  );
}
