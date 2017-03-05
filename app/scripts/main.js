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
    <div class="list-inline-item">
      <label class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" ng-model="$ctrl.data.active" ng-click="$ctrl.output()">
        <span class="custom-control-indicator"></span>
        <span class="custom-control-description">{{$ctrl.data.name}}</span>
      </label>
    </div> 
  `,
  controller: FilterButtonsController,
  bindings: {
    data: '=',
    output: '&'
  }
});

module.component('googleMap', {
  template: `
    <ng-transclude></ng-transclude> 
    <section class="full-bleed"></section>
  `,
  controller: GoogleMapController,
  transclude: true,
  bindings: {
    selected: '<'
  }
});

function GoogleMapController($element, $timeout) {
  this.defaultMarker = {lat: -25.363, lng: 131.044};
  this.$onInit = () => {
    $timeout(()=> {
      this.initMap();
    }, 2000);
  };

  this.$onChanges = (changes) => {
    let selected = changes.selected.currentValue;
    if(selected){
      console.log(selected);
    }
  };

  this.initMap = () => {
    console.log('init');
    const uluru = {lat: -25.363, lng: 131.044};

    const map = new google.maps.Map($element.find('section')[0], {
      zoom: 4,
      scrollwheel: false,
      navigationControl: false,
      mapTypeControl: false,
      scaleControl: false,
      draggable: false,
      center: uluru
    });



    var infowindow = new google.maps.InfoWindow({
      content: `<a href="#">Uluru</a>`
    });

    const marker = new google.maps.Marker({
      position: uluru,
      map: map,
      title: 'Uluru (Ayers Rock)'
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  }
}

module.component('placeItem', {
  template: `
    <div ng-click="$ctrl.selected({name: $ctrl.data})">{{$ctrl.data.name}}</div>
  `,
  controller: PlaceItemController,
  bindings: {
    data: '<',
    filters: '<',
    selected: '&'
  }
});

function PlaceItemController() {
  this.data = this.data || undefined;
  this.filters = this.filters || undefined;
  this.selected = this.selected || undefined;
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
    {name: 'Mission Chinese', desc: 'Hot hot, american chinese fusion', categories: ['Restaurant']},
    {name: 'Iza Ramen', desc: 'The best ramen outside of Japan', categories: ['Restaurant']},
    {name: 'Flora Grubb', desc: 'Coffee, nature, heated benches for your butt', categories: ['Cafe', 'Outdoor']},
    {name: 'Philz Coffee + Minnesota Steer project', desc: 'Get local coffee, get local art', categories: ['Cafe','Activity']},
    {name: 'SpeakEasy', desc: 'Get drunk, gamble, and live in 1920s', categories: ['Activity','Bar','Entertainment']},
    {name: 'Keiko A Nob Hill', desc: 'If you have money to burn, best food you\'ll ever have', categories: ['Restaurant']},
    {name: 'Piccino', desc: 'Go for brunch, get a pizza', categories: ['Cafe', 'Restaurant']},
    {name: 'Basa', desc: 'Best $8 sushi & poke', categories: ['Restaurant']},
    {name: 'Farmhouse', desc: 'Best Thai food with pretentious interior', categories: ['Restaurant']},
    {name: 'Nihon Whiskey', desc: 'Must go for whiskey lovers', categories: ['Bar']},
    {name: 'Limon Rotisserie', desc: 'Do yourself a favor and just get chicken & ceviche', categories: ['Restaurant']},
    {name: 'Alcatraz', desc: 'We haven\'t been but everyon says it\'s cool ¯\_(ツ)_/¯', categories: ['Activity']},
    {name: 'La Taqueria', desc: 'Best taco in San Francisco', categories: ['Restaurant']},
    {name: 'UtoEpia', desc: 'Get a massage, experience uTOEpia', categories: ['Activity']},
    {name: 'Golden Gate Park', desc: 'Get lost, it\'s big, and rid a Segway', categories: ['Outdoor']},
    {name: 'SFMoMA', desc: 'The only decent art museum in San Francisco', categories: ['Activity']},
    {name: 'Neighbor bakehouse', desc: 'Ditch Tartine, this one\'s better. Go early, or they sell out', categories: ['Cafe']},
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

  this.selected = (name)=> {
    this.currentMarker = name;
  };

  this.resetFilters = () => {
    this.filteredPlacesList = this.places;
  };

  this.output = () => {
    const getFilterByName = (i) => i.name;
    const removeFalse = (item) => item.filter(item => item.active);
    const doesPlaceIncludeItem = (place, item) => place.categories.includes(item);

    let finalFilter = this.places
            .filter(place => removeFalse(this.filterList)
            .map(getFilterByName)
            .some(item => doesPlaceIncludeItem(place, item)));

    if(finalFilter.length > 0 ) {
      this.filteredPlacesList = finalFilter;
    } else {
      this.resetFilters();
    }
  }
}
