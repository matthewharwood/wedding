const module = angular.module('app', ['ui.router']);

module.config(function($urlRouterProvider, $stateProvider) {
  let routes = [];
  $urlRouterProvider.when('', '/');
  routes.push({
    name: 'home',
    url: '/',
    templateUrl: './home/index.html'
  });

  routes.push({
    name: 'visit',
    url: '/visit',
    template: '<visit-component></visit-component>',
  });

  routes.push({
    name: 'photo',
    url: '/photo',
    templateUrl: './photo/index.html'
  });

  routes.forEach(i => $stateProvider.state(i));
});

module.component('visitComponent', {
  templateUrl:'./visit/index.html',
  controller: VisitController,
});

module.component('filterButtons', {
  template: `
  <ul class="list-inline list-unstyled">
    <li class="list-inline-item">
      <label class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" ng-model="$ctrl.data.active" ng-click="$ctrl.output()">
        <span class="custom-control-indicator"></span>
        <span class="custom-control-description">{{$ctrl.data.name}}</span>
      </label>
    </li> 
  </ul>
  `,
  controller: FilterButtonsController,
  bindings: {
    data: '=',
    output: '&'
  }
});


module.component('placeItem', {
  template: `
   
    <div>{{$ctrl.data.name}}</div>
  `,
  controller: PlaceItemController,
  bindings: {
    data: '<',
    filters: '<'
  }
});
function PlaceItemController() {
  this.data = this.data || undefined;
  this.filters = this.filters || undefined;

  this.$onInit = () => {

  }
}
function FilterButtonsController() {
  this.data = this.data || undefined;
}

function VisitController() {
  this.filteredPlacesList = [];
  this.filterList = [
    {name: 'See all', active: false},
    {name: 'Restaurant', active: false},
    {name: 'Cafe', active: false},
    {name: 'Outdoor', active: false},
    {name: 'Entertainment', active: false},
    {name: 'Activity', active: false},
    {name: 'Bar', active: false}
  ];

  this.places = [
    {name: 'place1', desc: 'Restaurant Get Drunk, gamble, and live in 1920', categories: ['Restaurant']},
    {name: 'place2', desc: 'Entertainment 2Get Drunk, gamble, and live in 1920', categories: ['Entertainment']},
    {name: 'place3', desc: 'Activity 2Get Drunk, gamble, and live in 1920', categories: ['Activity']},
    {name: 'place4', desc: 'Bar 3Get Drunk, gamble, and live in 1920', categories: ['Bar']},
    {name: 'place5', desc: 'Outdoor 4Get Drunk, gamble, and live in 1920', categories: ['Outdoor']},
    {name: 'place6', desc: 'Cafe 5Get Drunk, gamble, and live in 1920', categories: ['Cafe']},
  ];

  this.$onInit = () => {
    this.filteredPlacesList = this.places;
  };

  this.output = () => {
    console.log('output');
    const getFilterByName = (i) => i.name;
    const removeFalse = (item) => item.filter(item => item.active);

    const trueList = removeFalse(this.filterList).map(getFilterByName);
    this.filteredPlacesList = this.places.filter(place => trueList.some(item => place.categories.includes(item)));
    // // console.log(_curryPlaceCategoriesIncludeFilterName(this.places[0]) (this.filterList[1]));
    // this.filteredPlacesList = console.log(this.places.filter((place) => place.some((item) => arrIncludeName(item, item))));
  }
}
