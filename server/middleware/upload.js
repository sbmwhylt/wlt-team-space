import imagekit from "../config/imagekit.js";

export const uploadToImageKit = async (file) => {
  const result = await imagekit.upload({
    file: file.data, 
    fileName: file.name, 
    folder: "/test",
  });
  return result.url;
};
