import { Parroquias } from '../../parroquias/collection';
import { Images } from '../../images/collection';
import { getImages } from '../../parroquias/utils';
import { cursorHasImageWithUrl } from '../../images/utils';
import { FixJobStatus, FixJob } from './fix-job';
import { FixJobRegistry, FixJobRegistar } from './fix-job-registry';
import { Name } from './DHM-images-fix-job-info';
import { FS } from 'meteor/cfs:base-package';
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
    this.stats = {
      numParroquias: 0,
      numParroquiasWithImagesUpdated: 0,
      numParroquiasWithImages: 0 
    };
    this.update(this.notYetRun);
  }
  /*
   * Reset this FixJob statistics
   */
  resetting(){
    this.stats = {
      numParroquias: 0,
      numParroquiasWithImagesUpdated: 0,
      numParroquiasWithImages: 0 
    };
  }
  /*
   * Starts processing the parroquias with parroquias img links
   */
  starting(){
    // update the initial number of parroquias, and parroquias with
    // images
    this.stats.numParroquias = Parroquias.find().count();
    let parroquiasWithImages = Parroquias.find(
      {
        "img.url": {  
          $exists: true,
          $type: 2
        }
      }
    );
    this.stats.numParroquiasWithImages = parroquiasWithImages.count();
    this.update(FixJobStatus.running);
    parroquiasWithImages.forEach(
      (parroquia) => {
        // process each parroquia
        // console.log(`parroquia's name: ${parroquia.name} - ${this.stats.numParroquias}`);
        // update parroquias stats
        let good = false;
        let images = getImages(parroquia);  
        let url = parroquias.img.url;
        let [hasImage, id] = cursorHasImageWithUrl(images, url);
        if(!hasImage){
          let file = null;
          try {
            file = Images.insert(url);
            good = true;
          } catch(error) {
            console.log(`Fixes.DHMImagesFixJob: Error getting image for \
for ${url}`);
            console.log(error);
          }
          if(good){
            this.stats.numParroquiasWithImagesUpdated++;
            //TODO: determine how to best store reference to
            //file records
          }
        }
        if((this.stats.numParroquiasWithImagesUpdated % 50) == 0){
          this.update(FixJobStatus.running);
        }
      }
    );
  }
}

FixJobRegistry.register(Name, new DHMImagesFixJob(), false);

