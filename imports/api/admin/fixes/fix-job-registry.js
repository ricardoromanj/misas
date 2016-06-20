import { Meteor } from 'meteor/meteor';
import Fiber from 'fibers';
import { FixJobStatus, FixJob } from './fix-job';
import ServiceLocator from 'servicelocatorjs';
import _ from 'lodash';

export const FixJobRegistry = ServiceLocator;
/*
 * All of the FixJob functions for different FixJobs will be
 * registered to the FixJobRegistry whereby the corresponding
 * functions for that FixJob will be called
 *
 */
export class FixJobRegistar {
  constructor(){
    this.status = FixJobStatus.notYetRun;
    this.stats = {}
  }
  /*
   * function reset
   *
   * This function must be implemented to update the stats
   */
  reset(){
    this.resetting();
  }
  /*
   * function update 
   *
   * This function lets the job update it status, and stats. It is 
   * mostly here as an helper method.
   */
  update(status){
    this.status = status;
    FixJob.upsert(
      {
        name: this.name
      },
      {
        name: this.name,
        status: this.status,
        stats: this.stats
      }
    );  
  }
  /*
   * function start
   *
   * start a new fiber with this job in it.
   */
  start(){
    let unrunFiber = Fiber(() => {
      this.fiber = Fiber.current;
      this.update(FixJobStatus.running);
      this.reset();
      this.starting();
      // after finishing set fiber to null
      this.update(FixJobStatus.finished);
      this.fiber = null;
    });
    if(!_.isNil(this.fiber)){
      /* stop current fiber and start another... should
         wait for the fiber to stop if it possible */
      this.update(FixJobStatus.stopping);
      this.fiber.reset();

    }
    this.update(FixJobStatus.starting);
    /* always run a new fiber */
    unrunFiber.run(); 
    return true;
  }
  /*
   * function stop
   *
   * Stop the currently running job
   */
  stop(){
    if(!_.isNil(this.fiber)){
      this.fiber.reset();
    }
    return true;
  }
  /*
   * functin resetting
   *
   * Logic to clean up statistics information about the job should
   * be done here.
   */
  resetting(){
    Meteor.Error('method-not-implemented', 'This methods has yet to\
 to be implemented.');
  }
  /*
   * function starting
   *
   * This method will be called whenever the job is starting to let
   * the job do it's fix. You should run your fix in an asynchronous
   * fiber.
   */
  starting(){
    Meteor.Error('method-not-implemented', 'This methods has yet to\
 to be implemented.');
  }
  /*
   * function stopping
   *
   * This method will be called whenever the job is stopping to let
   * you stop the job immediatly... I am still thinking how to 
   * implement this with fibers
   */
  stopping(){
    Meteor.Error('method-not-implemented', 'This methods has yet to\
 to be implemented.');
  }
}

