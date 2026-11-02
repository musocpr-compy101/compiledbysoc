import 'server-only';
import {S3Client} from '@aws-sdk/client-s3';
export function storage(){
 const {R2_ACCOUNT_ID,R2_ACCESS_KEY_ID,R2_SECRET_ACCESS_KEY,R2_BUCKET}=process.env;
 if(!R2_ACCOUNT_ID||!R2_ACCESS_KEY_ID||!R2_SECRET_ACCESS_KEY||!R2_BUCKET)throw new Error('File storage is not connected yet.');
 return {bucket:R2_BUCKET,client:new S3Client({region:'auto',endpoint:`https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,credentials:{accessKeyId:R2_ACCESS_KEY_ID,secretAccessKey:R2_SECRET_ACCESS_KEY},requestChecksumCalculation:'WHEN_REQUIRED',responseChecksumValidation:'WHEN_REQUIRED'})};
}
