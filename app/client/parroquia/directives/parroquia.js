console.log('Loaded parroquia directive!');

angular.module('parroquias').directive('parroquia', function($stateParams) {
  return {
    restrict: 'E',
    scope: {
      id: '='
    },
    templateUrl: 'app/client/parroquia/views/parroquia.html',
    controllerAs: 'pc',
    controller: function($scope, $reactive) {
      var pc;
      $reactive(this).attach($scope);
      pc = this;
      pc.id = $scope.id;
      pc.helpers({
        parroquia: function() {
          return Parroquias.findOne({});
        }
      });
      pc.subscribe('parroquia', function() {
        return [pc.id];
      });
      return console.log('parroquia loaded');
    }
  };
});
