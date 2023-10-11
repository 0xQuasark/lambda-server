// Importing AWS SDK modules for S3 operations

// // .mjs version of the code
// import { S3Client, GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
// // .js version of the code
const { S3Client, GetObjectCommand, PutObjectCommand, S3 } = require('@aws-sdk/client-s3'); // code preinstalled by AWS, to do S3 operations -> Reading and Writing

// Initializing the S3 client
let s3client = new S3({ region: 'us-west-2' });

// Lambda function entry point
export const handler = async (event) => {
  // Log initial message and event data
  console.log('Lambda code is running!', event.Records);

  // Extract bucket name and file name from the event
  const bucketName = event.Records[0].s3.bucket.name;
  const fileName = event.Records[0].s3.object.key.replace('images/', '');
  const fileSize = event.Records[0].s3.object.size;
  const fileType = event.Records[0].s3.object.eTag;

  // Log bucket and file information
  console.log(`Bucket name is ${bucketName} and file name is ${fileName}`);

  // Initialize imagesArray variable to hold image metadata
  let imagesArray;

  // Try to get the existing images.json from the root directory
  try {
    const command = {
      Bucket: bucketName,
      Key: 'images.json', // File located in root directory
    };
    
    // Fetch images.json content
    const result = await s3client.send(new GetObjectCommand(command));
    const existingData = await result.Body.transformToString();
    imagesArray = JSON.parse(existingData);
  } catch (error) {
    // If images.json does not exist, create a new array
    console.log("images.json not found, creating new array");
    imagesArray = [];
  }

  // Create new image metadata object
  const newImage = {
    Name: fileName,
    Size: fileSize,
    Type: fileType,
  };

  // Check if the image already exists in the array
  const existingImageIndex = imagesArray.findIndex(image => image.Name === fileName);

  // If image exists, update its metadata; otherwise, add the new image
  if (existingImageIndex !== -1) {
    imagesArray[existingImageIndex] = newImage;
  } else {
    imagesArray.push(newImage);
  }

  // Prepare to update images.json in the root directory
  const putCommand = {
    Bucket: bucketName,
    Key: 'images.json', // File located in root directory
    Body: JSON.stringify(imagesArray),
    ContentType: 'application/json'
  };

  // Upload the updated images.json back to S3
  await s3client.send(new PutObjectCommand(putCommand));

  // Prepare and return Lambda response
  const response = {
    statusCode: 200,
    body: JSON.stringify('Successfully updated images.json'),
  };

  return response;
};
