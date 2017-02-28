const module = angular.module('app', ['ui.router']);

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
        <input type="checkbox" class="custom-control-input">
        <span class="custom-control-indicator"></span>
        <span class="custom-control-description">{{$ctrl.data}}</span>
      </label>
    </li> 
  </ul>
  `,
  controller: FilterButtonsController,
  bindings: {
    data: '<',
    output: '&',
  }
});


module.component('placeItem', {
  template: `
    <div>{{$ctrl.data.name}}</div>
  `,
  controller: PlaceItemController,
  bindings: {
    data: '<'
  }
});
function PlaceItemController() {
  this.data = this.data || undefined;
  this.$onInit = () => {

  }
}
function FilterButtonsController() {
  this.data = this.data || undefined;
  this.$onInit = () =>{
    console.log(this.data)
  }
}

function VisitController() {
  this.filterList = ['See all', 'Restaurant', 'Cafe', 'Outdoor', 'Entertainment', 'Activity', 'Bar'];
  this.places = [
    {name: 'place1', desc: 'Get Drunk, gamble, and live in 1920', categories: ['Restaurant']},
    {name: 'place2', desc: '2Get Drunk, gamble, and live in 1920', categories: ['Entertainment']},
    {name: 'place3', desc: '2Get Drunk, gamble, and live in 1920', categories: ['Activity']},
    {name: 'place4', desc: '3Get Drunk, gamble, and live in 1920', categories: ['Bar']},
    {name: 'place5', desc: '4Get Drunk, gamble, and live in 1920', categories: ['Outdoor']},
    {name: 'place6', desc: '5Get Drunk, gamble, and live in 1920', categories: ['Cafe']},
  ];
  this.$onInit = () => {
    console.log('wtf')
  }
}
