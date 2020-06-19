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

const fileFilter = (req, file, cb) => {

    console.log('FILE: ', file);
    
    if (!file) {
        req.fileValidationError = "Not Exist Image File";
        cb(null, false);
    } else {
        let array = file.originalname.split('.');
        console.log('ARRAY: ', array);
        const fileType = array[1];
        if (fileType === 'jpg' || fileType === 'png' || fileType === 'jpeg' || fileType === 'gif') {
            cb(null, true);
        } else {
            req.fileValidationError = "Can Only jpg, jpeg, png, gif";
            cb(null, false);
        }
    }
};

const key = (req, file, cb) => {
    console.log('KEY REQ BODY: ', req.session);
    let array = file.originalname.split('.');
    cb(null, 'images/' + moment().format("YYMMDDHHmmssss") + 'users.' + array[1]);
};

exports.s3Upload = multer({
    storage: mutlerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKETNAME,
        contentType: mutlerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: key,
        serverSideEncryption: 'AES256'
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter,
})
