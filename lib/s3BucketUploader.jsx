import React from "react";
import AWS from "aws-sdk";

// Config AWS SDK (move to .env if you want, just remember it's exposed!)
AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY,
  region: "eu-north-1", // e.g., 'ap-south-1'
});

const s3 = new AWS.S3();

/**
 * Uploads one or more image files to S3 and returns their metadata
 * @param {File[]} files - Single file or array of File objects
 * @returns {Promise<Array>} - Array of metadata objects
 */
export const uploadImagesToS3 = async (files) => {
  const fileArray = Array.isArray(files) ? files : [files];

  const uploadPromises = fileArray.map((file) => {
    const imageId = Date.now() + "-" + Math.floor(Math.random() * 10000);
    const fileName = `${imageId}-${file.name}`;

    const params = {
      Bucket: "slvista",
      Key: fileName,
      Body: file,
      ContentType: file.type,
      // ACL: "public-read", // viewable via direct link
    };

    return s3
      .upload(params)
      .promise()
      .then((data) => data.Location);
    // id: imageId,
    // name: file.name,

    // type: file.type,
    // size: file.size,
    // s3Key: fileName,
  });

  return Promise.all(uploadPromises);
};
