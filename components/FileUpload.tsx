import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import React from "react";

type FileUploadType = {
  endpoint: "serverImage" | "messageFile";
  value: string;
  onChange: (url?: string) => void;
};

const FileUpload = ({ endpoint, value, onChange }: FileUploadType) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative w-20 h-20">
        <Image
          src={value}
          alt="image"
          fill
          className="object-cover object-center rounded-full"
        />
        <button
          onClick={() => onChange("")}
          type="button"
          className="bg-rose-500 rounded-full p-1 absolute right-0 top-0 shadow-sm z-10"
        >
          <X className="w-4 h-4 text-slate-50" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="flex items-center gap-x-2 relative rounded-md bg-background/10 p-2 my-2">
        <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500 dark:text-indigo-400 text-sm hover:underline"
        >
          {value}
        </a>

        <button
          onClick={() => onChange("")}
          type="button"
          className="bg-rose-500 rounded-full p-1 absolute -right-2 -top-2 shadow-sm z-10"
        >
          <X className="w-4 h-4 text-slate-50" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(e) => {
        console.log("Error", e);
      }}
    />
  );
};

export default FileUpload;
