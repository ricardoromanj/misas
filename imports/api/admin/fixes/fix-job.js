import { Mongo } from 'meteor/mongo';
/*
 * FixJobStatus
 *
 * defined the types of statuses the jobs can have
 *
 */
export const FixJobStatus = {
  notYetRun: 'not-yet-run',
  running: 'running',
  starting: 'starting',
  stopping: 'stopping',
  finished: 'finished' 
}
/*
 * FixJob
 *
 * The collection storing information of job status and other
 * information specific to each kind of job.
 *
 */
export const FixJob = new Mongo.Collection("FixJob");
