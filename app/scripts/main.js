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
    {name: 'Restaurant', active: false},
    {name: 'Cafe', active: false},
    {name: 'Outdoor', active: false},
    {name: 'Entertainment', active: false},
    {name: 'Activity', active: false},
    {name: 'Bar', active: false}
  ];

  this.places = [
    {name: 'Bernal Heights Park', desc: 'Our favorite San Francisco vantage point', categories: ['Outdoors']},
    {name: 'Zero Zero', desc: 'Where we first met', categories: ['Restaurant']},
    {name: 'Trouble Coffee + General Store', desc: 'Ultimate hipster experience near the ocean', categories: ['Cafe', 'Activity']},
    {name: 'Iza Ramen', desc: 'The best ramen outside of Japan', categories: ['Restaurant']},
    {name: 'Flora Grubb', desc: 'Coffee, nature, heated benches for your butt', categories: ['Cafe', 'Outdoor']},
    {name: 'Philz Coffee + Minnesota Steer project', desc: 'Get local coffee, get local art', categories: ['Cafe']},
    {name: 'Piccino', desc: 'Go for brunch, get a pizza', categories: ['Cafe', 'Restaurant']},
    {name: 'Piccino', desc: 'Go for brunch, get a pizza', categories: ['Cafe', 'Restaurant']},
    {name: 'Piccino', desc: 'Go for brunch, get a pizza', categories: ['Cafe', 'Restaurant']},
    {name: 'Piccino', desc: 'Go for brunch, get a pizza', categories: ['Cafe', 'Restaurant']},
    {name: 'Piccino', desc: 'Go for brunch, get a pizza', categories: ['Cafe', 'Restaurant']},
    {name: 'Piccino', desc: 'Go for brunch, get a pizza', categories: ['Cafe', 'Restaurant']},
    {name: 'Piccino', desc: 'Go for brunch, get a pizza', categories: ['Cafe', 'Restaurant']},
    {name: 'Piccino', desc: 'Go for brunch, get a pizza', categories: ['Cafe', 'Restaurant']},
    {name: 'Piccino', desc: 'Go for brunch, get a pizza', categories: ['Cafe', 'Restaurant']},
    {name: 'Piccino', desc: 'Go for brunch, get a pizza', categories: ['Cafe', 'Restaurant']},
    {name: 'Neighbor bakehouse', desc: 'Ditch Tartine, this one\'s better. Go early, or they sell out', categories: ['Cafe' ]},
    {name: 'House of Air', desc: 'Trampolines with a view', categories: ['Activity']},
    {name: 'ASIASF', desc: 'Alternative entertainment', categories: ['Entertainment', 'Bar', 'Restaurant']},
    {name: 'Dolores Park', desc: 'Meet weirdos', categories: ['Outdoor']},
    {name: 'Noeteca', desc: 'Freshest French-inspired brunch', categories: ['Restaurant']},
    {name: 'Mac Daddy', desc: 'Gourmet macaroni and cheese', categories: ['Restaurant']},
    {name: 'Trolley', desc: 'Easiest way to become a stereotypical tourist', categories: ['Activity']},
    {name: 'Eiji', desc: 'Needs copy', categories: ['Activity']},
  ];

  this.$onInit = () => {
    this.resetFilters();
  };
  this.resetFilters = () => {
    this.filteredPlacesList = this.places;
  }
  this.output = () => {
    const getFilterByName = (i) => {
      console.log('wtffff');
      return i.name;
    } ;
    const removeFalse = (item) => item.filter(item => item.active);

    const finalFilter = this.places.filter(place => {
          return removeFalse(this.filterList)
            .map(getFilterByName)
            .some(item => {
              console.log(item);
              return place.categories.includes(item)
            })
        });

    if(finalFilter.length > 0 ) {
      this.filteredPlacesList = finalFilter;
    } else {
      this.resetFilters();
    }
  }
}
