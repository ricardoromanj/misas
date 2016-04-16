
import { Meteor } from 'meteor/meteor';

function onReady() {
  angular.bootstrap(document, [
    'parroquias' 
  ], {
    strictDi: true
  });
}

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}
