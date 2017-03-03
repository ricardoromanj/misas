import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { FixJob } from './fix-job';

Meteor.publish(
  'misas.admin.fixes.fixjob', (name) => {
    check(name, String);
    return FixJob.find({name: name});
  }
);
