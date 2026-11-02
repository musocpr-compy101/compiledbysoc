export const MAX_FILE=4*1024*1024;
export function detectType(bytes:Uint8Array):string|null {
 const b=Buffer.from(bytes);
 if(b.length>=8 && b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return 'image/png';
 if(b.length>=3 && b[0]===255 && b[1]===216 && b[2]===255)return 'image/jpeg';
 if(b.length>=12 && b.toString('ascii',0,4)==='RIFF' && b.toString('ascii',8,12)==='WEBP')return 'image/webp';
 if(b.length>=5 && b.toString('ascii',0,5)==='%PDF-')return 'application/pdf';
 return null;
}
export function safeFilename(s:string){return s.replace(/[^a-zA-Z0-9._-]/g,'_').slice(0,100)||'document';}
