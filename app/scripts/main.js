const module = angular.module('app', ['ui.router']);

console.log(module);

module.config(function($stateProvider) {
  const about = {
    name: 'hello',
    url: '/hello',
    template: '<h3>hello world!</h3>'
  };
  $stateProvider.state(about);
});
