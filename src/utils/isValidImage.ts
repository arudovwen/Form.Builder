export function isValidImage(value) {
    if (!value) return false;
    // Check if the value is a base64 encoded image
    const base64Pattern = /^data:image\/(jpeg|png|gif|bmp|webp);base64,/i;

    // Check if the value is a valid image URL (ends with image file extensions)
    const urlPattern = /\.(jpeg|jpg|png|gif|bmp|webp)$/i;

    // Check if the value matches either of the patterns
    return base64Pattern.test(value) || urlPattern.test(value);
  }
