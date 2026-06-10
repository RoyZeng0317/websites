const B2 = require('backblaze-b2');

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_APP_KEY,
});

async function uploadToB2(filePath, fileName, bucketName) {
  await b2.authorize();

  const { data: { buckets } } = await b2.getBucket({ bucketName });
  if (buckets.length === 0) {
    throw new Error(`Bucket "${bucketName}" not found`);
  }
  const bucketId = buckets[0].bucketId;

  const { data: { uploadUrl, authorizationToken } } = await b2.getUploadUrl({ bucketId });

  const fs = require('fs');
  const fileBuffer = fs.readFileSync(filePath);

  const { data } = await b2.uploadFile({
    uploadUrl,
    uploadAuthToken: authorizationToken,
    fileName,
    data: fileBuffer,
    mime: 'application/octet-stream',
  });

  return data;
}

async function deleteFromB2(fileName, bucketName) {
  await b2.authorize();

  const { data: { buckets } } = await b2.getBucket({ bucketName });
  if (buckets.length === 0) {
    throw new Error(`Bucket "${bucketName}" not found`);
  }
  const bucketId = buckets[0].bucketId;

  const { data: { files } } = await b2.listFileNames({
    bucketId,
    startFileName: fileName,
    maxFileCount: 1,
  });

  if (files.length === 0 || files[0].fileName !== fileName) {
    throw new Error(`File "${fileName}" not found`);
  }

  await b2.deleteFileVersion({
    fileId: files[0].fileId,
    fileName,
  });
}

module.exports = { uploadToB2, deleteFromB2 };
