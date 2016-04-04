if Meteor.isClient
  console.log 'Loaded parroquias!'
  angular.module(
    'parroquias'
    [
      'angular-meteor'
      'ui.router'
      'ui.bootstrap.progressbar'
    ]
  )
