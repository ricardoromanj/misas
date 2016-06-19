import { Meteor } from 'meteor/meteor';
import Fiber from 'fibers';
import { FixJobStatus, FixJob } from './fix-job';
import ServiceLocator from 'servicelocatorjs';

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
   * function update 
   *
   * This function lets the job update it status, and stats. It is 
   * mostly here as an helper method.
   */
  update(status){
    this.status = status;
    FixJob.update(
      {
        name: this.name
      },
      {
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
    this.unblock();
    let unrunFiber = Fiber(() => {
      this.fiber = Fiber.current;
      this.update(FixJobStatus.running);
      this.starting();
      // after finishing set fiber to null
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

