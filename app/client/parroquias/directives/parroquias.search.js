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
      pssc.pageInfo = {
        page: 0,
        perPage: 20
      };
      pssc.changePage = function(newPage){
        console.log(newPage);
        pssc.pageInfo.page = newPage;
      };
      pssc.helpers({
        parroquias: function() {
          return Parroquias.find({});
        },
        numParroquias: function() { 
          return Counts.get('numParroquias');
        } 
      });
      pssc.subscribe('parroquias.search', function() {
        return [
          {
            skip: parseInt(pssc.getReactively('pageInfo.page')*pssc.getReactively('pageInfo.perPage')),
            limit: parseInt(pssc.getReactively('pageInfo.perPage'))
          }, 
          pssc.getReactively('searchText')
        ];
      });
      return console.log('parroquias search loaded');
    }
  };
});
