import { Meteor } from 'meteor/meteor';
import { Parroquias } from './collection';
import { Images } from '../images/collection';
import _ from 'lodash';
/*
 * Published: parroquias
 * 
 * This method will returned parroquias based on contextual
 * information such as radius from person's location, and
 * any other contextual information we can get our hands on
 * such as perfered parroquias, parroquias most attended,
 * parroquias with most friends attended
 */ 
Meteor.publish('parroquias', function() {
  var selector;
  selector = {};
  return Parroquias.find(selector);
});

Meteor.publish('parroquia', function(id) {
  var selector;
  if(_.isNil(id)){
    throw new Meteor.Error('param-not-specified', 'The id param\
 was no specified');
  }
  if(!_.isString(id)){
    throw new Meteor.Error('param-incorrect-type', 'The \'id\'\
 should be a String');
  }
  //publish both the parroquia and it's images
  console.log(Images.find({'metadata.owner': id}).fetch());
  return [
    Parroquias.find({
      _id: id
    }),
    Images.find({
      'metadata.owner': id
    })
  ]; 
});
/* Published: parroquias.search
 *
 * This method will return parroquias based upon the input
 * search query (q). It queries based on the name, or description
 * of the parroquias.
 * 
 * TODO: Should acomodate queries for dates, times, and other
 * stuff later on.
 */
Meteor.publish('parroquias.search', function(options, q) {
  var selector;
  if (options == null) {
    options = {};
  }
  if (q == null) {
    q = "";
  }
  selector = {
    name: {
      $regex: '.*' + (("" + q) || '') + (("" + q) && '.*'),
      $options: 'i'
    }
  };
  Counts.publish(this, 'numParroquias', Parroquias.find(selector), {
    onReady: true
  });
  return Parroquias.find(selector, options);
});


