import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
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
