console.log('Loaded parroquias directive!');

angular.module('parroquias').directive('parroquias', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/parroquias/views/parroquias.html',
    controllerAs: 'psc',
    controller: function($scope, $reactive) {
      $reactive(this).attach($scope);
      this.subscribe('parroquias');
      this.helpers({
        parroquias: function() {
          return Parroquias.find({});
        }
      });
      return console.log('parroquias loaded');
    }
  };
});
