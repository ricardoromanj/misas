import 'angular-material-data-table/dist/md-data-table.css'
import 'angular-material/angular-material.css'
import { Meteor } from 'meteor/meteor';

import '../imports/ui/routes';

_.forIn(process.env, (value, key) => {
  console.log(`${key} = ${value}`);
});

console.log(Meteor.settings);
_.forIn(Meteor.settings, (value, key) => {
	console.log(`${key} = ${value}`);
});

console.log(Meteor.settings.public);
console.log(Meteor.settings.public.ALL_SERVICES_GOOGLE_MAPS_KEY);
console.log(Meteor.process);
console.log(process);
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
