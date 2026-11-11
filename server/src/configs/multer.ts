import multer from "multer";

export const upload = multer({

  storage: multer.memoryStorage(),
  limits: {fileSize: 2 * 1024 * 1024,},
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpeg", "image/webp"].includes(file.mimetype)){
      cb(null, true);
    } else {
      cb(new Error("Only PNG, JPG and WEBP are allowed"));
    }
  },
});