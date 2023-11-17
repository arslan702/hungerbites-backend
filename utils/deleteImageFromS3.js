const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const retry = require("async-retry");
const s3Client = require("../config/aws");

async function deleteImageFromS3(key) {
  const bucketName = process.env.S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("S3 bucket name not specified");
  }

  const params = {
    Bucket: bucketName,
    Key: key,
  };

  const command = new DeleteObjectCommand(params);

  return retry(
    async () => {
      return await s3Client.send(command);
    },
    { retries: 3, factor: 2 }
  );
}

module.exports = deleteImageFromS3;
