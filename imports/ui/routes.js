import parroquias from './components/parroquias/parroquias';
import angularMeteorAuth from 'angular-meteor-auth';
import './components/parroquia/parroquia';
import './components/parroquia/parroquia-edit';
import './components/parroquias/parroquias.search';
import './components/admin/sources/DHM/DHM-parse';
import './services/module';
import './components/navigation/navigation';
import './components/user/settings/settings';


parroquias.config(function($urlRouterProvider, $stateProvider, $locationProvider, $mdIconProvider) {
    "ngInject";
    $locationProvider.html5Mode(true);
    $stateProvider.state('misas', {
      url: '/',
      views: {
        '@' : {
          template: '<parroquias></parroquias>'
        }
      }
    }).state('misas.parroquias', {
      abstract: true,
      url: 'parroquias/',
      template: '<ui-view/>'
    }).state('misas.parroquias.search', {
      url: 'search',
      views: {
        '@misas': {
          template: '<parroquias-search></parroquias-search>'
        }
      }
    }).state('misas.parroquia', {
      url: 'parroquia/{id}',
      template: '<parroquia id="id"></parroquia>',
      controller: function($scope, $stateParams) {
        "ngInject";
        $scope.id = $stateParams.id;
        return console.log("parroquia state loaded");
      }
    }).state('misas.parroquia-edit', {
      url: 'parroquia/{id}/edit',
      template: '<parroquia-edit id="id"></parroquia-edit>',
      controller: function($scope, $stateParams) {
        $scope.id = $stateParams.id;
        return console.log("parroquia edit state loaded");
      }
    })
    //--ADMIN-- RELATED STATES
    .state('misas.admin', {
      url: 'admin/',
      templateUrl: 'imports/ui/components/admin/admin.html',
      controller: function($scope) {
        "ngInject";
        return console.log("admin");
      },
      resolve: {
        admin: function(userHelpers){
          return userHelpers.checkIsRootP();
        }
      } 
    })
    .state('misas.admin.dhm-parse', {
      url: 'dhm-parse/',
      controller: function($scope) {
        "ngInject";
        return console.log("dhm parsing");
      },
      views: {
        '@misas': {
          template: '<dhm-parse></dhm-parse>'
        }
      },
      resolve: {
        admin: function(userHelpers){
          return userHelpers.checkIsRootP();
        }
      } 
    })
    //--USER-- states
    .state('misas.login', {
      url: 'login/',
      template: '<login></login>' 
    })
    .state(
      'misas.user', 
      {
        url: 'user/',
        templateUrl: 'imports/ui/components/user/user.html'
      }
    )
    .state(
      'misas.user.settings', 
      {
        url: 'settings/',
        template: '<settings></settings>',
        resolve: {
          loggedIn: function(userHelpers){
            return userHelpers.checkIsLoggedInP();
          }
        }
      }
    );

    $urlRouterProvider.otherwise('/parroquias');

    const iconPath =  '/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/';

    $mdIconProvider
      .iconSet('social',
        iconPath + 'svg-sprite-social.svg')
      .iconSet('action',
        iconPath + 'svg-sprite-action.svg')
      .iconSet('communication',
        iconPath + 'svg-sprite-communication.svg')
      .iconSet('content',
        iconPath + 'svg-sprite-content.svg')
      .iconSet('toggle',
        iconPath + 'svg-sprite-toggle.svg')
      .iconSet('navigation',
        iconPath + 'svg-sprite-navigation.svg')
      .iconSet('image',
        iconPath + 'svg-sprite-image.svg');
  }
)
.run(function($rootScope, $state) {
    'ngInject';
    
    $rootScope.$on('$stateChangeError',
      (event, toState, toParams, fromState, fromParams, error) => {
        if (error === 'AUTH_REQUIRED') {
          $state.go('misas.login');
        }
      }
    );
  }
);
