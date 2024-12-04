const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const MIN_DIMENSIONS = { width: 200, height: 200 };

export const validateImageFile = (file) => {
  return new Promise((resolve, reject) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error("File size must be less than 5MB"));
      return;
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      reject(new Error("Only JPG and PNG files are allowed"));
      return;
    }

    // Check image dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      if (
        img.width < MIN_DIMENSIONS.width ||
        img.height < MIN_DIMENSIONS.height
      ) {
        reject(new Error("Image must be at least 200x200 pixels"));
        return;
      }

      resolve();
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Invalid image file"));
    };

    img.src = objectUrl;
  });
};
