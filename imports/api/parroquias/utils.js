import { Meteor } from 'meteor/meteor';
import { Parroquias } from './collection';
import { Images } from '../images/collection';
import _ from 'lodash';

/*
 * getImages
 *
 * This function returns a cursor to the images owned by this 
 * Parroquias. The Parroquias ID or an actual Parroquias document
 * can be used to return the cursor to the images.
 */
/*
export function getImages(query = null){
  if(_.isString(query)){
    let parroquia = Parroquias.find({_id: query});
    // check a parroquias was returned
    if(parroquia.count() == 0){
      throw new Meteor.Error('parroquia-does-not-exists', `The\
 Parroquias with the given ID ${parroquias._id} does not exists`);
    }
    parroquia = parroquia.fetch()[0];
    // if this parroquias has images then assign it to the
    // parroquias
    if(_.has(parroquia, 'images')){
      imagesArray = parroquia.images;
    }
  } else if(_.isObjectLike(query)){
    // if this parroquias has images then assign it to the
    // parroquias
    if(_.has(parroquia, 'images')){
      imagesArray = parroquia.images;
    }
  } else {
    throw new Meteor.Error('param-type-incorrect', 'Param used\
 to get Images is neither String or Object');
  }
  return Images.find(
    {
      '_id': {
        $in: imagesArray
      }
    }
  );
}
*/
