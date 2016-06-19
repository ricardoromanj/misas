import { FixJobStatus, FixJob } from './fix-job';
import { FixJobRegistry, FixJobRegistar } from './fix-job-registry';
import { Name } from './DHM-images-fix-job-info';
const jobStatus = {
  name: Name,
  status: FixJobStatus.notYetRun,
  stats: {
    numParroquias: 0,
    numParroquiasWithImages: 0,
    numParroquiasWithImagesProcessed: 0
  },
  logs: []
};
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
    parroquias.forEach(
      (parroquia) => {
        //process each parroquia
        console.log(`parroquia's name: ${parroquia.name}`);
      }
    );
  }
}

FixJobRegistry.register(Name, new DHMImagesFixJob(), false);

