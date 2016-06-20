import { Parroquias } from '../../parroquias/collection';
import { FixJobStatus, FixJob } from './fix-job';
import { FixJobRegistry, FixJobRegistar } from './fix-job-registry';
import { Name } from './DHM-images-fix-job-info';
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
    let parroquias = Parroquias.find({});
    let numUpdated = 0;
    parroquias.forEach(
      (parroquia) => {
        //process each parroquia
        console.log(`parroquia's name: ${parroquia.name} - ${this.stats.numParroquias}`);
        // update parroquias stats
        this.stats.numParroquias++;
        if((this.stats.numParroquias % 50) == 0){
          this.update(FixJobStatus.running);
        }
      }
    );
  }
}

FixJobRegistry.register(Name, new DHMImagesFixJob(), false);

