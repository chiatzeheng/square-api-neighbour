import AWS from "aws-sdk";

try {
  AWS.config.update({
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS,
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET,
    region: "ap-southeast-1",
  });
  console.log("Success!")
} catch (error) {
  console.log(error);
}

export const s3 = new AWS.S3();
