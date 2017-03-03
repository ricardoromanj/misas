import { Meteor } from 'meteor/meteor';
import { startDHMImagesFixJob } from './DHM-images-fix-job';
import { checkIsRoot, checkIsRootWithError } from '../../users/utils';
/**
 * The following methods are the entry points for the DHM images
 * fix. These will invoke and run a job that will process all
 * of the parroquias.
 */
Meteor.methods({
  'misas.admin.fixes.DHM-images-fix.start': () => {
    console.log('calling fixes method');
    checkIsRootWithError();
    startDHMImagesFixJob();
  },
  'misas.admin.fixes.DHM-images-fix.status': () => {
    checkIsRootWithError();
    return true;
  }
});
