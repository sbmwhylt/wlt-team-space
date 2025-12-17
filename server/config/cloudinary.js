import { v2 as cloudinary } from "cloudinary";

// Automatically reads CLOUDINARY_URL
cloudinary.config();

export default cloudinary;
