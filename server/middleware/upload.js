import multer from "multer";
import { CloudinaryStorage } from "@fluidjs/multer-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    resource_type: "auto",
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

export default upload;
