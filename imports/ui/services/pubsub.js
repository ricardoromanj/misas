import angular from 'angular';
import pubsub from 'pubsub-js';

const moduleName = 'misas.services.pubsub';
export const name = 'pubsub';

console.log('loading pubsub services');
angular.module(moduleName, [])
.service(name, () => {
  return pubsub;
});

export default moduleName;
