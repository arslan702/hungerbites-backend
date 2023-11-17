const multer = require("multer");
const { uploadImagesToS3 } = require("../utils/uploadImgesToS3");

exports.uploadCNICImages = (destination ,imageFieldFront, imageFieldBack) => {
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (
        file.fieldname === imageFieldFront ||
        file.fieldname === imageFieldBack
      ) {
        if (file.mimetype.startsWith("image/")) {
          cb(null, true);
        } else {
          cb(new Error("Only images are allowed"));
        }
      } else {
        cb(new Error("Unexpected field"));
      }
    },
  }).fields([
    { name: imageFieldFront, maxCount: 1 },
    { name: imageFieldBack, maxCount: 1 },
  ]);

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

      // Check if the uploaded files exist and have the required properties
      if (
        !req.files ||
        !req.files[imageFieldFront] ||
        !req.files[imageFieldBack] ||
        !req.files[imageFieldFront][0].buffer ||
        !req.files[imageFieldBack][0].buffer ||
        !req.files[imageFieldFront][0].mimetype ||
        !req.files[imageFieldBack][0].mimetype
      ) {
        return res.status(400).json({ message: "Invalid image data" });
      }
      const front = req.files[imageFieldFront][0];
      const back = req.files[imageFieldBack][0];
      // Call the uploadImageToS3 function to upload the images to S3
      try {
        // console.log("here is the front image:", front);
        // console.log("here is the back image:", back);
        // const frontImageUrl = await uploadImagesToS3(front);
        // const backImageUrl = await uploadImagesToS3(back);

        // req.body.url = { frontImageUrl, backImageUrl };

        next();
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
  };
};

// const multer = require("multer");

// const uploadImage = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5 MB
//   },
// }).fields([{ name: "front_image" }, { name: "back_image" }]);

// module.exports = uploadImage;
