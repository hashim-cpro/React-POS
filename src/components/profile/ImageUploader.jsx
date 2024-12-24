import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { validateImageFile } from "../../utils/imageValidation";
import ImagePreview from "./ImagePreview";
import { compressImage } from "../../utils/imageCompression";
import { uploadProfilePicture } from "../../utils/profileUpload";

const ImageUploader = ({ userId, currentImageId, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await validateImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
      setSelectedFile(file);
      setError(null);
    } catch (err) {
      setError(err.message);
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const compressedFile = await compressImage(selectedFile);
      const convertedFile = new File([compressedFile], selectedFile.name, {
        type: selectedFile.type,
        lastModified: Date.now(),
      });

      const { fileUrl } = await uploadProfilePicture(
        convertedFile,
        userId,
        currentImageId
      );

      if (!fileUrl) {
        throw new Error("Failed to get file URL");
      }

      setPreviewUrl(fileUrl);
      onUploadSuccess(fileUrl);
      setSelectedFile(null);
      fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <ImagePreview url={previewUrl} />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileSelect}
          className="hidden"
          id="profile-picture-input"
        />

        <label
          htmlFor="profile-picture-input"
          className="btn btn-secondary mt-4 cursor-pointer"
        >
          Select Image
        </label>
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      {selectedFile && (
        <div className="flex justify-center">
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? "Uploading..." : "Upload Picture"}
          </button>
        </div>
      )}
    </div>
  );
};

ImageUploader.propTypes = {
  userId: PropTypes.string.isRequired,
  onUploadSuccess: PropTypes.func.isRequired,
  currentImageId: PropTypes.string,
};

export default ImageUploader;
