require("dotenv").config();
const s3Client = require("../config/aws");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const retry = require("async-retry");

const destination = "cincs/";

async function uploadImagesToS3(image) {
  console.log("here is image ready to upload:", image);
}

// async function uploadImagesToS3(image) {
//   console.log("here is teh image " , image);
//   if (!image || !image.buffer || !image.mimetype) {
//     console.log(image);
//     throw new Error("Invalid image data");
//   }

//   const bucketName = process.env.S3_BUCKET_NAME;
//   if (!bucketName) {
//     throw new Error("S3 bucket name not specified");
//   }

//   const fileName = `${destination}${uuidv4()}-${image.originalname}`;
//   const uploadParams = {
//     Bucket: bucketName,
//     Key: fileName,
//     Body: image.buffer,
//     ContentType: image.mimetype,
//   };

//   return new Promise((resolve, reject) => {
//     const command = new PutObjectCommand(uploadParams);

//     retry(
//       async (bail, attempt) => {
//         console.log(`Attempt ${attempt} to upload image to S3`);

//         try {
//           const response = await s3Client.send(command);
//           console.log(
//             `Successfully uploaded image to S3 at ${response.Location}`
//           );
//           resolve(response.Location);
//         } catch (err) {
//           console.error(
//             `Error uploading image to S3 (attempt ${attempt}):`,
//             err
//           );

//           if (attempt === 3) {
//             reject(err);
//           } else {
//             bail(err);
//           }
//         }
//       },
//       {
//         retries: 3,
//         factor: 2,
//         onRetry: (err) => console.log(`Retrying due to error: ${err}`),
//       }
//     );
//   });
// }

module.exports = { uploadImagesToS3 };
