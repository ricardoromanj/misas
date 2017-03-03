import _ from 'lodash';

export function cursorHasImageWithUrl(cursor, url){
  //TODO: check type of cursor
  if(cursor.count() == 0){
    return [false, ""];
  }
  //go thru each image
  let images = cursor.fetch();
  for(let image of images){
    if(
      _.has(image, 'data.source.url') && 
      _.isString(image.data.source.url) &&
      image.data.source.url == url
      )
    {
      return [ true, image._id ]; 
    }
  }
  return [false, ""];
}
