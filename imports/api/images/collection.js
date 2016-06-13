import { FS } from 'meteor/cfs:base-package';
/**
 * Images
 *
 * This collection will be used to store generic images
 * from different collections within the misas website
 */
var Images = new FS.Collection("images", {
  stores: [
    new FS.Store.GridFS("images")
  ]
});

export default Images;
