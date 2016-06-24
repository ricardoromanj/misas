import { Meteor } from 'meteor/meteor';


/* code taken from npm package wait-until, had to be modified
   to run on fibers, I will submit an issues as soon as I can we
   I will do this on a straight fiber */
export class WaitUntil {
  constructor(interval, times, condition, cb){
    if(interval != undefined){
      this.interval(interval)
        .condition(condition)
        .times(times)  
        .done(cb);
    }
  }
  interval(_interval) {
    this._interval = _interval;
    return this;
  }
  times(_times) {
    this._times = _times;
    return this;
  }
  condition(_condition, cb) {
    this._condition = _condition;
    if (cb) {
      return this.done(cb);
    } else {
      return this;
    }
  }
  done(cb) {
    if (!this._times) {
      throw new Error('waitUntil.times() not called yet');
    }
    if (!this._interval) {
      throw new Error('waitUntil.interval() not called yet');
    }
    if (!this._condition) {
      throw new Error('waitUntil.condition() not called yet');
    }

    let runCheck = (i, prevResult) => {
      if (i == this._times) {
        cb(prevResult);
      } else {
        Meteor.setTimeout(() => {
          let gotConditionResult = (result) => {
            if (result) {
              cb(result);
            } else {
              runCheck(i + 1, result);
            }
          };
          gotConditionResult(this._condition());
        }, this._interval);
      }
    };
    runCheck(0);  
    return this;
  }
}


