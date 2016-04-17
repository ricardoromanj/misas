import { Meteor } from 'meteor/meteor';

import '../imports/ui/components/parroquias/parroquias';
import '../imports/ui/routes';

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
