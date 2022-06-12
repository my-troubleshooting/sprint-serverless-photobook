/**
 * A Lambda function that returns a static string
 */
console.log('Loading function');
const aws = require('aws-sdk');
const s3 = new aws.S3({
    apiVersion: '2006-03-01'
});
const sharp = require('sharp');

exports.helloFromLambdaHandler = async (event, context) => {
 // 원본 버킷으로부터 파일 읽기
 const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
const s3Object = await s3.getObject({
    Bucket: bucket,
    Key: key
  }).promise()
  
  // 이미지 리사이즈, sharp 라이브러리가 필요합니다.
  const data = await sharp(s3Object.Body)
      .resize(200)
      .jpeg({ mozjpeg: true })
      .toBuffer()
  
  // 대상 버킷으로 파일 쓰기
  const result = await s3.putObject({
    Bucket: "definition-lambda-hwicheon", 
    Key: key,
    ContentType: 'image/jpeg',
    Body: data,
    ACL: 'public-read'
  }).promise()
}
