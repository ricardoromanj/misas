import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import 'meteor/dburles:collection-helpers';
import Images from '../images/collection';
/*
 * @Collection Parroquias 
 * 
 * name: "parroquia" #String denoting type of event       
 *  desc: ""     #String describing the event 
 *  info:        #Object containing date/time/scheduled information
 *    type:      #String denoting type "single","repeat", ...
 *    #when single
 *    single:
 *      start_time:
 *      end_time:
 *    #when repeat
 *    repeat: 
 *      rules:
 *        #start date of rule
 *        start_time:
 *        end_time:
 *        #end date of rule
 *        #when weekly
 *        weekly:   
 *          mon: 
 *            start_time: 
 *            end_time:
 *          sun: 
 *            start_time:
 *            end_time:
 *        #when monthly
 *        monthly:   #debemos de pensar mejor como hacer esto
 *          day:     #Number or Array used to specify the first day = 1
 *                   #the last day = -1, or last and first [1, -1]
 *          week:   
 *            which: #Number of Array used to specify the first week = 1        
 *                   #the last week = -1 or last and first [1, -1]
 *            day:   #Number or Array used to specify the day of the week 
 *         yearly:   #I guess you can now see the pattern
 *
 *        #Array of Objects containing days on which to repeat event
 */
export const Parroquias = new Mongo.Collection("parroquias");
/*
 * helpers
 *
 * Parroquias helpers will be methods that will aid in several
 * issues like getting the image files from the db... etc.
 */
Parroquias.helpers({
  isStored: function(){
    return _.has(this, '_id') && _.isString(this._id);
  },
  update: function(){
    //if this parroquia is new then insert it
    if(!this.isStored()){
      let id = Parroquias.insert(
        this
      );
      this._id = id;
    } else {
      //update the parroquia
      Parroquias.update(
        {_id: this._id },
        this
      )
    }
  },
  getImages: function(){
    if(!_.has(this, 'images')){
      //add an empty array
      this.images = [];
      return;
    }
    //check that this.images is an Array
    if(!_.isArray(this.images)){
      //error this.images must be an Array
      throw new Meteor.Error('images-incorrect-type', 'Parroquias images should\
 be an Array');
    }
    if(this.images.length == 0){
      return;
    }
    let ids = _.map(this.images, () => {
      return image._id;
    }); 
    this.images = Images.find(
      {
        _id: {
          $in: ids
        }
      }
    ).fetch();
  },
  addImage: function(fileObj){
    if(_.isNil(fileObj)){
      throw new Meteor.Error('Parroquia: Can\'t add an undefined image file');
    }
    //add the images array just in case
    if(!_.has(this, 'images')){
      this.images = [];
    }
    //Check id does not already have an owner
    if(_.has(fileObj, 'metadata.owner') &&
       _.isString(fileObj.metadata.owner)
      ){
      //If we don't have an _id then throw an error
      if(_.isNil(this._id)){
        throw new Meteor.Error(`Parroquia: image ${fileObj._id} with owner\
 ${fileObj.metadata.owner} can't be owned by this parroquia since it does\
  not already have an _id` );
      } else if (_.isString(this._id) && this._id != fileObj.metadata.owner){
        throw new Meteor.Error(`Parroquia: image ${fileObj._id} with owner\
 ${fileObj.metadata.owner} is already owned by another parroquia than this one\
  ${this._id}`);
      }
      //continue we own this parroquia so just update it
      let index = _.findIndex(this.images, (image) => {
        return image._id == fileObj.metadata.owner;
      });
      //does not exists so add it
      if(index == -1){
        this.images.push(fileObj);
      } else {
        this.images[index] = fileObj;
      }
      //TODO: does this update the image?, update myself
    } else {
      //the image file does not have an owner so add it
      if(_.isNil(this._id)){
        throw new Meteor.Error(`Parroquia: image ${fileObj._id} can't\
 be owned by this parroquia since it does not already have an _id` );
      }
      _.merge(fileObj, { metadata: { owner: this._id } }); 
      this.images.push(fileObj);
      //TODO: maybe unnecessary if new insert, if old update
    }
    this.update();
  }
});
Parroquias.allow({
  insert: function(userId, doc) {
    if (!(doc instanceof object)) {
      return false;
    }
    if ((doc.diocesis_id == null) ||
        (doc.id == null) || 
        (doc.state_id == null) ||
        (doc.city_id == null)) {
      return false;
    }
    return true;
  },
  update: function() {
    if (!(doc instanceof object)) {
      return false;
    }
    if ((doc.diocesis_id == null) ||
        (doc.id == null) || 
        (doc.state_id == null) || 
        (doc.city_id == null)) {
      return false;
    }
    return true;
  }
});

