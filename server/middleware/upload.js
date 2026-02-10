import imagekit from "../config/imagekit.js";

export const uploadToImageKit = async (file, folderPath = "/uploads") => {
  const result = await imagekit.upload({
    file: file.data, 
    fileName: file.name, 
    folder: folderPath, 
  });
  return result.url; 
};