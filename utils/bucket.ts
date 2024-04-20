import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

interface File {
  uri: Blob;
  name: string;
}

const options = {
  keyPrefix: "Singapore/",
  bucket: process.env.EXPO_PUBLIC_BUCKET,
  region: "ap-southeast-1",
  successActionStatus: 201,
};

let credentials = {
  accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS,
  secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET,
};

const client = new S3Client({
  region: options.region,
  credentials: {
    accessKeyId: credentials.accessKeyId || "",
    secretAccessKey: credentials.secretAccessKey || "",
  },
});

export const s3 = async (file: File) => {
  const command = new PutObjectCommand({
    Bucket: options.bucket,
    Key: "Singapore/" + file.name,
    Body: file.uri,
  });
  try {
    return await client.send(command);
  } catch (err) {
    console.error(err);
  }
};
