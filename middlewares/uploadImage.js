const multer = require("multer");
const { uploadImageToS3 } = require("../utils/uploadProductImgeToS3");

exports.uploadImage = (destination, imageField) => {
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.fieldname !== imageField) {
        return cb(new Error("Unexpected field"));
      }
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only images are allowed"));
      }
    },
  }).single(imageField);

  return (req, res, next) => {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({ message: "Unexpected field" });
        }
        return res.status(400).json({ message: "File upload error" });
      } else if (err) {
        console.log(err);
        return res.status(400).json({ message: "File upload error" });
      }

      // Check if the uploaded file exists and has the required properties
      if (!req.file || !req.file.buffer || !req.file.mimetype) {
        return res.status(400).json({ message: "Invalid image data" });
      }

      // Call the uploadImageToS3 function to upload the image to S3
      try {
        const imageUrl = await uploadImageToS3(req.file);
        console.log({imageUrl})
        req.body.image = imageUrl;
        next();
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
  };
}