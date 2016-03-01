if Meteor.isClient
  console.log 'Loaded misas!'
  angular.module(
    'misas' 
    [ 'angular-meteor'
      'ui.router' ]
  )
