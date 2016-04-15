console.log('Loaded parroquias directive!');

angular.module('parroquias').directive('parroquiasSearch', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/client/parroquias/views/parroquias.search.html',
    controllerAs: 'pssc',
    controller: function($scope, $reactive) {
      var pssc;
      $reactive(this).attach($scope);
      pssc = this;
      pssc.helpers({
        parroquias: function() {
          return Parroquias.find({});
        }
      });
      pssc.subscribe('parroquias.search', function() {
        return [{}, pssc.getReactively('searchText')];
      });
      return console.log('parroquias search loaded');
    }
  };
});
