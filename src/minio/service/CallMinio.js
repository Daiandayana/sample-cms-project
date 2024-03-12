// MinioServerCall.js
const AWS = require("aws-sdk");

const CallMinio = ({ accessKey, secretKey }) => {
  if (!accessKey || !secretKey) {
    throw new Error(
      "Missing AWS credentials. Please provide accessKeyId and secretAccessKey."
    );
  }

  return new AWS.S3({
    endpoint: "http://localhost:9000",
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    s3ForcePathStyle: true,
    signatureVersion: "v4",
  });
};

// Example usage
// const AwsSdkClient = MinioServer({
//     accessKey: process.env.REACT_APP_ACCESS_KEY,
//     secretKey: process.env.REACT_APP_SECRET_KEY,
// });

export default CallMinio;
