const module = angular.module('app', ['ui.router']);

console.log(module);

module.config(function($stateProvider) {
  const about = {
    name: 'home',
    url: '/',
    templateUrl: './home/index.html'
  };
  $stateProvider.state(about);
});
