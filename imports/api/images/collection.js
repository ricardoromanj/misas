import { FS } from 'meteor/cfs:base-package';
/*function addMetaSourceUrl(fileObj, readStream, writeStream){
  console.log('add meta');
  if(_.has(fileObj, 'data.source.url') &&
     _.isString(fileObj.data.source.url)
    ){
    console.log(fileObj);
    fileObj.metadata = {
      source: {
        url: fileObj.data.source.url
      }
    };
  }
  //readStream.pipe(writeStream);
}
*/
/**
 * Images
 *
 * This collection will be used to store generic images
 * from different collections within the misas website
 */
export const Images = new FS.Collection("images", {
  stores: [
    new FS.Store.GridFS("images")
  ],
  filter: {
    allow: {
      contentType: ['image/*']
    }
  }
});
