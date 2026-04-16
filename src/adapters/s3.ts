import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const S3_REGION = process.env.S3_REGION;
const S3_BUCKET = process.env.S3_BUCKET;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRET_KEY = process.env.S3_SECRET_KEY;

if (!S3_REGION) throw new Error("Missing S3_REGION");
if (!S3_BUCKET) throw new Error("Missing S3_BUCKET");
if (!S3_ACCESS_KEY) throw new Error("Missing S3_ACCESS_KEY");
if (!S3_SECRET_KEY) throw new Error("Missing S3_SECRET_KEY");

const s3Client = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
});

/*

fullImage
thumbnail
compressed

*/

// type ProfileCard = {
//   id: string;
//   display_name: string;
//   username: string;
//   images: {
//     thumbnail: string;
//     fullImage: string;
//     compressed: string;
//   };
// };

// <img src={profile.images.compressed}>

async function uploadImageToS3(
  imageBuffer: Buffer,
  fullFileName: string, // minbild.jpg
  contentType: string,
) {
  // Byter filnamn
  const timestamp = Date.now(); // 10291204312

  const partitionedFileName = fullFileName.split("."); // ['minbild', 'jpg']

  const fileName = partitionedFileName[0]; // 'minbild'
  const fileExtension = partitionedFileName.pop();

  const finalFileName = `${timestamp}-${fileName}`;

  // Med hjälp av bibliotek kan vi komprimera bilden och skapa en ny kopia av den som är komprimerad

  // const compressedImage = await compressImage(imageBuffer)

  // const thumbnail = await getThumbnail(imageBuffer)

  // Konfigurerar uppladdning
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: S3_BUCKET,
      Key: `${finalFileName}.${fileExtension}`, // 10202919831341-minbild.jpg
      Body: imageBuffer,
      ContentType: contentType,
    },
  });

  // Laddar vi upp
  const result = await upload.done();

  // Returnerar vi länken till bilden.
  return result.Location;
}

export default uploadImageToS3;
