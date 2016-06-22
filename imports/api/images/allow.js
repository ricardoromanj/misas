import { checkIsRoot } from '../users/utils';
import { Images } from './collection';

Images.allow({
  insert: () => {
    return checkIsRoot();
  },
  update: () => {
    return checkIsRoot(); 
  },
  remove: () => {
    return checkIsRoot();
  },
  download: () => {
    return checkIsRoot();
  }
});
