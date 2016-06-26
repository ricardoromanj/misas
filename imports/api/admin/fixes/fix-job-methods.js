import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import _ from 'lodash';
import { FixJob, FixJobStatus } from './fix-job.js';
/* fix jobs need to imported */
import './DHM-images-fix-job';
import { FixJobRegistry } from './fix-job-registry';

Meteor.methods(
  {
    'misas.admin.fixes.fixjob.names': function (){
      return null;
    },
    'misas.admin.fixes.fixjob.start': function(name){
      check(name, String);
      /* get the fix job with the specified name if it does
         exists */
      console.log(`fixes.fixjob.start: Starting job with ${name}`);
      let fixjob = FixJobRegistry.get(name);
      if(_.isNil(fixjob)){
        throw new Meteor.Error('fixjob-does-not-exists', 'There is not FixJob with that name');
      }
      /* start the new FixJob */      
      this.unblock();
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
