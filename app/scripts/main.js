const module = angular.module('app', ['ui.router']);

console.log(module);

module.config(function($stateProvider) {
  let routes = [];

  routes.push({
    name: 'home',
    url: '/',
    templateUrl: './home/index.html'
  });

  routes.push({
    name: 'visit',
    url: '/visit',
    templateUrl: './visit/index.html'
  });

  routes.push({
    name: 'photo',
    url: '/photo',
    templateUrl: './photo/index.html'
  });
  
  routes.forEach(i => $stateProvider.state(i));
});

