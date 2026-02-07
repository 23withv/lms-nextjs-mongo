"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash, FileVideo } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface FileUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
  resourceType?: "image" | "video";
}

export const FileUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
  resourceType = "image"
}: FileUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="flex flex-col gap-4 items-start w-full">
      {value && resourceType === "image" && (
        <div className="relative w-64 h-36 rounded-md overflow-hidden border">
            <div className="absolute top-2 right-2 z-10">
                <Button type="button" variant="destructive" size="icon" onClick={() => onRemove(value)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
            <Image 
                fill 
                className="object-cover" 
                alt="Upload" 
                src={value} 
            />
        </div>
      )}

      {value && resourceType === "video" && (
        <div className="relative w-full max-w-sm bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden border p-2">
             <div className="absolute top-2 right-2 z-10">
                <Button type="button" variant="destructive" size="icon" onClick={() => onRemove(value)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                <FileVideo className="h-10 w-10" />
                <p className="line-clamp-1">{value}</p>
            </div>
            <p className="text-xs text-center text-emerald-500 mt-2 font-medium">Video uploaded successfully</p>
        </div>
      )}

      {!value && (
        <CldUploadWidget 
            onSuccess={onUpload} 
            uploadPreset="lms_preset"
            options={{
                maxFiles: 1,
                resourceType: resourceType
            }}
        >
            {({ open }) => {
                const onClick = () => {
                    open();
                }
                return (
                    <Button 
                        type="button" 
                        variant="outline" 
                        disabled={disabled} 
                        onClick={onClick}
                        className="w-full h-40 border-dashed flex flex-col gap-2 bg-muted/20"
                    >
                        {resourceType === "video" ? (
                            <FileVideo className="h-10 w-10 text-muted-foreground" />
                        ) : (
                            <ImagePlus className="h-10 w-10 text-muted-foreground" />
                        )}
                        <span className="text-sm text-muted-foreground font-medium">
                            {resourceType === "video" ? "Upload Video Material" : "Upload Course Thumbnail"}
                        </span>
                        <span className="text-xs text-muted-foreground/60">
                            {resourceType === "video" ? "Max size 100MB suggested" : "16:9 aspect ratio recommended"}
                        </span>
                    </Button>
                )
            }}
        </CldUploadWidget>
      )}
    </div>
  );
};