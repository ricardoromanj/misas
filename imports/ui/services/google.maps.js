import angular from 'angular';
import _ from 'lodash';
import Promise from 'promise';
import googleMapsLoader from 'google-maps';
import { Meteor } from 'meteor/meteor';

var googleInstance = null;

googleMapsLoader.KEY = process.env['DEV_SERVICES_GOOGLE_MAPS_KEY'];
googleMapsLoader.VERSION = process.env['DEV_SERVICES_GOOGLE_MAPS_VERSION'];
googleMapsLoader.LIBRARIES = ['geometry'];
googleMapsLoader.LANGUAGE = 'es';
googleMapsLoader.REGION = 'MX';

const promise = new Promise((resolve, reject) => {
  googleMapsLoader.load((google) => {
    console.log('resolving google.maps service');
    googleInstance = google;
    if(_.isNil(google)){
      console.log('reject');
      reject('UNABLE_TO_GET_GOOGLE_MAPS');
      return;
    }
    resolve(google);
  });
});

const moduleName = 'misas.services.google.maps';
export const name = 'googleLoader';

angular.module(moduleName, [])
.service(name, ($q) => {
  'ngInject'; 
  //get api key from server
  /*
  Meteor.call('services.google.maps', (error, auth) => {
    if(!_.isNil(error) || _.isNil(auth)){
      throw 'Can\'t give authorization to use google.maps service';
    }
    console.log(auth);
    googleMapsLoader.KEY = `${auth.key}`;
    googleMapsLoader.VERSION = `${auth.version}`;
    googleMapsLoader.LIBRARIES = ['geometry'];
    googleMapsLoader.LANGUAGE = 'es';
    googleMapsLoader.REGION = 'MX';
    */
    console.log('returning google.maps service');
    
    /*
  });
  */
  return {
    promise: promise,
    google: googleInstance
  };
});

export default moduleName;
