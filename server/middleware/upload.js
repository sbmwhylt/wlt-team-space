import imagekit from "../config/imagekit.js";

export const uploadToImageKit = async (file) => {
  const result = await imagekit.upload({
    file: file.data, 
    fileName: file.name, 
    folder: "/uploads",
  });

  return result.url;
};
