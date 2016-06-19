import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { FixJob, FixJobStatus } from './fix-job.js';
/* fix jobs need to imported */
import './DHM-images-fix-job';
import { FixJobRegistry } from './fix-job-registry';

Meteor.methods(
  {
    'misas.admin.fixes.fixjob.status': (name) => {
      let count = 0;
      let fixJobCursor = FixJob.find({name: name});
      count = fixJobCursor.count(); 
      /* if count is equal to zero then add a document with
         notYetRun status */
      if(count == 0){
        return FixJob.insert(
          {
            name: name,
            status: FixJobStatus.notYetRun
          }
        );
      }
      /* else return just that one document to the client */
      return fixJobCursor;
    },
    'misas.admin.fixes.fixjob.start': (name) => {
      /* get the fix job with the specified name if it does
         exists */
      let fixjob = FixJobRegistry.get(name);
      if(_.isNil(fixjob)){
        throw new Meteor.Error('fixjob-does-not-exists', 'There is not FixJob with that name');
      }
      /* start the new FixJob */      
      fixjob.start();
      return true;
    },
    'misas.admin.fixes.fixjob.stop': (name) => {
      let fixjob = FixJobRegistry.get(name);
      if(_.isNil(fixjob)){
        throw new Meteor.Error('fixjob-does-not-exists', 'There is not FixJob with that name');
      }
      fixjob.stop();
      return true;
    }
  }
);
