# AWS Lambda Server

AWS Lambda allows writing code that is triggered in the cloud, without thinking about maintaining servers. We’ll use it today to automatically run some processing on image files after they’re uploaded to an S3 Bucket.

## Feature Tasks
1. Create an S3 Bucket with “open” read permissions, so that anyone can see the images/files in their browser.
2. A user should be able to upload an image at any size, and update a dictionary of all images that have been uploaded so far.
3. When an image is uploaded to your S3 bucket, it should trigger a Lambda function which must:
   - Download a file called “images.json” from the S3 Bucket if it exists.
   - The images.json should be an array of objects, each representing an image. Create an empty array if this file is not present.
   - Create a metadata object describing the image. Name, Size, Type, etc.
   - Append the data for this image to the array. Note: If the image is a duplicate name, update the object in the array, don’t just add it.
   - Upload the images.json file back to the S3 bucket.

## Usage
To use this AWS Lambda function, upload an image to the specified S3 bucket. The Lambda function will automatically trigger, downloading the `images.json` file from the S3 bucket (or creating a new one if it doesn't exist), creating a metadata object for the uploaded image, appending the image data to the array in `images.json`, and uploading the updated `images.json` file back to the S3 bucket.

## Issues Encountered
During the deployment of this Lambda function, there were issues encountered with permissions and bucket policies. Make sure to set the S3 bucket with "open" read permissions and correctly configure the trigger for the Lambda function, using this permission policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

## Link to images.json
You can find the `images.json` file [here](https://cflab-bucket.s3.us-west-2.amazonaws.com/images.json).
