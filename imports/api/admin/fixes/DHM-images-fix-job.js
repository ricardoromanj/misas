import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { Parroquias } from '../../parroquias/collection';
import { Images } from '../../images/collection';
import { getImages } from '../../parroquias/utils';
import { cursorHasImageWithUrl } from '../../images/utils';
import { FixJobStatus, FixJob } from './fix-job';
import { FixJobRegistry, FixJobRegistar } from './fix-job-registry';
import { Name } from './DHM-images-fix-job-info';
import { FS } from 'meteor/cfs:base-package';
import { WaitUntil } from '../../utils/wait-until';
/*
 * function DHMImagesFixJob
 *
 * This job handles processing all of the churches and
 * storing an image for each of them if they contain an
 * URL to a DHM image.
 */
class DHMImagesFixJob extends FixJobRegistar {

  /*
   * Intially this job's stats will be zeroed out.
   */
  constructor(){
    super();
    this.name = Name;
    this.title = "Get all images from DHM for current set of Parroquias";
    this.description = "This fix job finds all of the parroquias with \
image urls and tries to get the images for all of them.";
    this.stats = {
      numParroquias: {
        value: 0,
        human: 'Number of Parroquias stored'
      },
      numParroquiasWithImagesUpdated: {
        value: 0,
        human: 'Number of Parroquias with their Images which were Updated'
      },
      numParroquiasWithImages: {
        value: 0,
        human: 'Number of Parroquias with a URL for an Image'
      },
      numParroquiasWithImagesPreviouslyUpdated: {
        value: 0,
        human: 'Number of Parroquias with a URL for an Imange & Previously Updated'
      } 
    };
    this.update(this.notYetRun);
  }
  /*
   * Reset this FixJob statistics
   */
  resetting(){
    this.stats = {
      numParroquias: {
        value: 0,
        human: 'Number of Parroquias stored'
      },
      numParroquiasWithImagesUpdated: {
        value: 0,
        human: 'Number of Parroquias with their Images which were Updated'
      },
      numParroquiasWithImages: {
        value: 0,
        human: 'Number of Parroquias with a URL for an Image'
      },
      numParroquiasWithImagesPreviouslyUpdated: {
        value: 0,
        human: 'Number of Parroquias with a URL for an Imange & Previously Updated'
      } 
    };
  }
  /*
   * Starts processing the parroquias with parroquias img links
   */
  starting(){
    // update the initial number of parroquias, and parroquias with
    // images
    this.stats.numParroquias.value = Parroquias.find().count();
    let parroquiasWithImages = Parroquias.find(
      {
        "img.url": {  
          $exists: true,
          $type: 2
        }
      }
    );
    this.stats.numParroquiasWithImages.value = parroquiasWithImages.count();
    this.update(FixJobStatus.running);
    parroquiasWithImages.forEach(
      (parroquia) => {
        // process each parroquia
        // console.log(`parroquia's name: ${parroquia.name} - ${this.stats.numParroquias}`);
        // update parroquias stats
        let waitTillFileUploads = Meteor.wrapAsync(this.waitUntilFileUploads, this);
        let url = parroquia.img.url;
        //get this parroquias images info
        parroquia.getImages();  
        let imageFound = _.find(parroquia.images, (image) => {
          return _.has(image, 'metadata.source.url') && 
            image.metadata.source.url == url;
        });
        if(_.isNil(imageFound)){
          try {
            let newImage = Images.insert(url);
            parroquia.addImage(newImage);
            newImage.update({$set: { 'metadata.source.url': url }});
            //console.log(newImage);
            //process one image at a time so wait for this image to
            //download
            waitTillFileUploads(newImage);    
            console.log(`uploaded ${parroquia.name}`);
            this.stats.numParroquiasWithImagesUpdated.value++;
          } catch (error) {
            console.log(`DHMImagesFixJob: issue downloading url: ${url}`); 
            console.log(error);
          }
          //if((this.stats.numParroquiasWithImagesUpdated % 0) == 0){
          this.update(FixJobStatus.running);
          //}
        } else {
          this.stats.numParroquiasWithImagesPreviouslyUpdated.value++;
          this.update(FixJobStatus.running);
        }
      }
    );
  }
  waitUntilFileUploads(fileObj, done){
    let waitUntil = new WaitUntil();
    waitUntil.interval(200)
      .times(400)
      .condition(function(){
        //console.log(`check is uploaded: ${fileObj.isUploaded()}`);
        return fileObj.isUploaded();
      })
      .done(function(){
        console.log(`finished uploading image`);
        done(null, true);
      });
  }
}

FixJobRegistry.register(Name, new DHMImagesFixJob(), false);

