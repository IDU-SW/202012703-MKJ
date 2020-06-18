require('dotenv').config();

const AWS = require('aws-sdk');
const multer = require('multer');
const mutlerS3 = require('multer-s3');
const moment = require('moment');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region : process.env.AWS_REGION
});

exports.S3Upload = multer({
    storage: mutlerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKETNAME,
        contentType: mutlerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            console.log(file.originalname);
            cb(null, 'images/' + moment().format("YYMMDDHHmmss") + file.originalname)
        },
        serverSideEncryption: 'AES256'
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});