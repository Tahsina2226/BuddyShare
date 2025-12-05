"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  X,
  Camera,
  Eye,
  Trash2,
  ImagePlus,
  CloudUpload,
  FileImage,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { showFancyAlert } from "./EventFormHelpers";
import API from "@/utils/api";

interface EventImageUploaderProps {
  currentImage: string;
  onImageUploaded: (imageUrl: string) => void;
  onImageRemoved: () => void;
}

export default function EventImageUploader({
  currentImage,
  onImageUploaded,
  onImageRemoved,
}: EventImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!validTypes.includes(file.type)) {
        showFancyAlert(
          "Please upload a valid image file (JPEG, PNG, WebP, GIF)",
          "error"
        );
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        showFancyAlert("Image size should be less than 5MB", "error");
        return;
      }

      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
        showFancyAlert(
          "🎉 Image selected! Click upload to save it",
          "info",
          3000
        );
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
  });

  const uploadImage = async () => {
    if (!imageFile) {
      showFancyAlert("Please select an image first", "warning");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append("image", imageFile);

      const token = getCurrentToken();
      if (!token) {
        showFancyAlert("Authentication token not found", "error");
        return;
      }

      const response = await API.post("/events/upload-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.data.success) {
        const imageUrl = response.data.data.fullUrl;

        console.log("Image upload response:", response.data);
        console.log("Setting image to:", imageUrl);

        onImageUploaded(imageUrl);
        showFancyAlert("✨ Image uploaded successfully!", "celebrate");

        setTimeout(() => {
          setPreviewImage(null);
          setImageFile(null);
          setUploadProgress(0);
        }, 1000);
      } else {
        showFancyAlert("Failed to upload image", "error");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      showFancyAlert(
        error.response?.data?.message || "Failed to upload image",
        "error"
      );
    } finally {
      setUploading(false);
    }
  };

  const getCurrentToken = () => {
    const possibleTokenKeys = [
      "token",
      "auth_token",
      "access_token",
      "jwt_token",
      "authToken",
    ];

    for (const key of possibleTokenKeys) {
      const storedToken = localStorage.getItem(key);
      if (storedToken && storedToken.length > 20) {
        return storedToken;
      }
    }

    return null;
  };

  const handleRemovePreview = () => {
    setPreviewImage(null);
    setImageFile(null);
    setUploadProgress(0);
    showFancyAlert("🔄 Image selection cleared", "info");
  };

  const handleImageUrlChange = (url: string) => {
    onImageUploaded(url);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 pb-2 border-white/10 border-b">
        <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 p-2 rounded-lg">
          <Camera className="w-5 h-5 text-amber-300" />
        </div>
        <h2 className="font-bold text-white text-xl">Event Image</h2>
      </div>

      <div className="space-y-6">
        <DropzoneArea
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
        />

        {previewImage && (
          <ImagePreview
            previewImage={previewImage}
            uploading={uploading}
            uploadProgress={uploadProgress}
            onRemove={handleRemovePreview}
            onUpload={uploadImage}
          />
        )}

        <ImageUrlInput
          currentImage={currentImage}
          onUrlChange={handleImageUrlChange}
          onImageRemoved={onImageRemoved}
        />

        {currentImage && (
          <CurrentImageDisplay
            currentImage={currentImage}
            onImageRemoved={onImageRemoved}
          />
        )}
      </div>
    </div>
  );
}

const DropzoneArea = ({
  getRootProps,
  getInputProps,
  isDragActive,
}: {
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
}) => (
  <div
    {...getRootProps()}
    className={`p-8 border-2 ${
      isDragActive
        ? "border-cyan-400/70 bg-cyan-500/10"
        : "border-white/20 hover:border-cyan-400/50"
    } border-dashed rounded-xl text-center transition-all duration-300 cursor-pointer hover:bg-white/5 group`}
  >
    <input {...getInputProps()} />
    <div className="relative">
      <div className="-top-4 -right-4 absolute bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 p-2 rounded-full transition-opacity duration-300">
        <Upload className="w-6 h-6 text-cyan-300 animate-bounce-soft" />
      </div>
      <div className="inline-flex justify-center items-center bg-gradient-to-r from-cyan-500/20 to-blue-500/20 mb-4 p-4 rounded-full">
        {isDragActive ? (
          <CloudUpload className="w-12 h-12 text-cyan-300" />
        ) : (
          <ImagePlus className="w-12 h-12 text-white/60" />
        )}
      </div>
    </div>
    <p className="mb-2 font-medium text-white/80">
      {isDragActive ? "Drop your image here!" : "Drag & drop your image here"}
    </p>
    <p className="mb-4 text-white/50 text-sm">
      or click to browse (Max 5MB, JPG, PNG, WebP, GIF)
    </p>
    <div className="flex justify-center gap-2">
      <div className="flex items-center text-white/40">
        <FileImage className="mr-1 w-4 h-4" />
        <span className="text-xs">Images only</span>
      </div>
    </div>
  </div>
);

const ImagePreview = ({
  previewImage,
  uploading,
  uploadProgress,
  onRemove,
  onUpload,
}: {
  previewImage: string;
  uploading: boolean;
  uploadProgress: number;
  onRemove: () => void;
  onUpload: () => void;
}) => (
  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm p-4 border border-emerald-500/30 rounded-xl">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <Eye className="w-5 h-5 text-emerald-400" />
        <span className="font-medium text-white">Image Preview</span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="hover:bg-white/10 p-1 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 text-white/70" />
      </button>
    </div>

    <div className="relative mb-4 rounded-lg overflow-hidden">
      <img
        src={previewImage}
        alt="Preview"
        className="w-full h-48 object-cover"
      />
    </div>

    {uploading ? (
      <UploadProgress uploadProgress={uploadProgress} />
    ) : (
      <button
        type="button"
        onClick={onUpload}
        disabled={uploading}
        className="bg-gradient-to-r from-emerald-500/20 hover:from-emerald-500/30 to-green-500/20 hover:to-green-500/30 disabled:opacity-50 px-4 py-3 border border-emerald-500/30 hover:border-emerald-500/50 rounded-xl w-full font-medium text-white transition-all disabled:cursor-not-allowed"
      >
        <CloudUpload className="inline mr-2 w-5 h-5" />
        Upload Image to Server
      </button>
    )}
  </div>
);

const UploadProgress = ({ uploadProgress }: { uploadProgress: number }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-white/80 text-sm">Uploading...</span>
      <span className="font-medium text-white">{uploadProgress}%</span>
    </div>
    <div className="bg-white/20 rounded-full w-full h-2">
      <div
        className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full h-2 transition-all duration-300"
        style={{ width: `${uploadProgress}%` }}
      />
    </div>
    <div className="flex justify-center">
      <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
    </div>
  </div>
);

const ImageUrlInput = ({
  currentImage,
  onUrlChange,
  onImageRemoved,
}: {
  currentImage: string;
  onUrlChange: (url: string) => void;
  onImageRemoved: () => void;
}) => (
  <div>
    <label className="block mb-2 font-medium text-white/80 text-sm">
      Or enter image URL directly
    </label>
    <div className="flex gap-2">
      <input
        type="url"
        value={currentImage || ""}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="https://example.com/event-image.jpg"
        className="flex-1 bg-white/10 px-4 py-3 border border-white/20 focus:border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-white/50"
      />
      {currentImage && (
        <button
          type="button"
          onClick={onImageRemoved}
          className="bg-gradient-to-r from-rose-500/20 hover:from-rose-500/30 to-red-500/20 hover:to-red-500/30 px-4 py-3 border border-rose-500/30 hover:border-rose-500/50 rounded-xl text-white transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  </div>
);

const CurrentImageDisplay = ({
  currentImage,
  onImageRemoved,
}: {
  currentImage: string;
  onImageRemoved: () => void;
}) => (
  <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm p-4 border border-cyan-500/30 rounded-xl">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-cyan-400" />
        <span className="font-medium text-white">Current Event Image</span>
      </div>
      <span className="bg-cyan-500/20 px-2 py-1 rounded-full text-cyan-300 text-xs">
        Active
      </span>
    </div>
    <div className="relative rounded-lg overflow-hidden">
      <img
        src={currentImage}
        alt="Event preview"
        className="w-full h-48 object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          showFancyAlert(
            "Failed to load image. Please check the URL.",
            "error"
          );
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="right-4 bottom-4 left-4 absolute flex justify-between items-center">
          <span className="text-white text-sm truncate">
            {currentImage.substring(0, 50)}...
          </span>
          <button
            type="button"
            onClick={() => window.open(currentImage, "_blank")}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
          >
            <Eye className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  </div>
);
