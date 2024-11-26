import * as fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "ap-southeast-2", // Asia Pacific (Hanoi) RegionID
  endpoint: "https://mos.ap-southeast-2.sufybkt.com", // Asia Pacific (Hanoi) Endpoint
  credentials: {
    accessKeyId: process.env.NEXT_SUFY_AK as string,
    secretAccessKey: process.env.NEXT_SUFY_SK as string,
  },
});

const fileStream = fs.createReadStream("<path/to/upload>");
fileStream.on("error", (err) => console.error(err));

s3.send(
  new PutObjectCommand({ Bucket: "<Bucket>", Key: "<Key>", Body: fileStream })
)
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
