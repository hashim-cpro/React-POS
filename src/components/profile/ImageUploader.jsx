import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { validateImageFile } from "../../utils/imageValidation";
import ImagePreview from "./ImagePreview";
import { compressImage } from "../../utils/imageCompression";
import { uploadProfilePicture } from "../../utils/profileUpload";
import { toast } from "react-toastify";

const ImageUploader = ({ userId, onUploadSuccess, currentImageId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Validate file
      await validateImageFile(file);

      // Create preview
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
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      // Compress image
      const compressedFile = await compressImage(selectedFile);

      //convert the blob into a file
      const convertedFile = new File([compressedFile], compressedFile.name, {
        type: selectedFile.type,
        lastModified: Date.now(),
      });

      // Upload to Appwrite
      const { fileId, fileUrl } = await uploadProfilePicture(
        convertedFile,
        userId,
        currentImageId
      );

      onUploadSuccess(fileUrl, fileId);
      toast.success("Profile picture updated successfully!");

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      fileInputRef.current.value = "";
    } catch (err) {
      console.log(err);
      setError(err.message);
      toast.error("Failed to upload profile picture");
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
