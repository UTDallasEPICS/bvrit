const API_ORIGIN = "http://localhost:5001";

export function getPetImageUrl(imagePath) {
  if (!imagePath) {
    return "";
  }

  if (/^https?:\/\//i.test(imagePath) && !imagePath.includes("localhost:5173")) {
    return imagePath;
  }

  const relativePath = imagePath
    .replace(/^https?:\/\/localhost:5173\/?/i, "")
    .replace(/^\/+/, "")
    .replace(/^(?:frontend\/src\/|src\/)?uploads?\/?/i, "");

  return `${API_ORIGIN}/uploads/${relativePath}`;
}
