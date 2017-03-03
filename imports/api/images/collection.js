import { FS } from 'meteor/cfs:base-package';
/**
 * Images
 *
 * This collection will be used to store generic images
 * from different collections within the misas website
 */
export const Images = new FS.Collection("images", {
  stores: [
    new FS.Store.GridFS("thumb", { transformWrite: createThumb }),
    new FS.Store.GridFS("original")
  ],
  filter: {
    allow: {
      contentType: ['image/*']
    }
  }
});

function createThumb(fileObj, readStream, writeStream) {
  // Transform the image into a 50x50px thumbnail
  gm(readStream, fileObj.name()).resize('50', '50').stream().pipe(writeStream);
};

