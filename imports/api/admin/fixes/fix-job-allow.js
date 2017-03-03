import { checkIsRoot } from '../../users/utils';
import { FixJob } from './fix-job';

FixJob.allow({
  insert: () => {
    return checkIsRoot();
  },
  update: () => {
    return checkIsRoot(); 
  },
  remove: () => {
    return checkIsRoot();
  }
});
