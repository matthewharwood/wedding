const module = angular.module('app', ['ui.router']);

module.config(function($urlRouterProvider, $stateProvider) {
  let routes = [];
  $urlRouterProvider.when('', '/');
  routes.push({
    name: 'home',
    url: '/',
    templateUrl: './home/index.html',
    controller: HomeController,
    controllerAs: '$ctrl'
  });

  routes.push({
    name: 'visit',
    url: '/visit',
    template: '<visit-component></visit-component>',
  });

  routes.push({
    name: 'attraction',
    url: '/attraction',
    template: '<attraction-component></attraction-component>',
  });

  routes.push({
    name: 'photo',
    url: '/photo',
    templateUrl: './photo/index.html'
  });

  routes.forEach(i => $stateProvider.state(i));
});

function HomeController() {
  this.places = [
    {name: 'San Francisco City Hall', desc: 'Our favorite San Francisco vantage point',link: 'https://goo.gl/maps/33KAL4uih972', categories: ['Outdoors'], pos: {lat: 37.7792639, lng:-122.4214586}},
    {name: 'Trou Normand', desc: 'Where we first met', categories: ['Restaurant'],link: 'https://goo.gl/maps/nnNeSH7ZdVx', pos: {lat: 37.7866685, lng: -122.4019677}},
    {name: 'Monroe', desc: 'Ultimate hipster experience near the ocean', categories: ['Cafe', 'Activity'],link: 'https://goo.gl/maps/EQpnyvbU6DL2', pos: {lat: 37.7979009, lng: -122.4071291}}
  ]
}


module.component('filterButtons', {
  templateUrl: 'attraction/filter-buttons.html',
  controller: FilterButtonsController,
  bindings: {
    data: '=',
    output: '&'
  }
});

function FilterButtonsController() {
  this.data = this.data || undefined;
}

module.component('googleMap', {
  template: `
    <ng-transclude></ng-transclude> 
    <div class="fixed-position full-bleed"><section class="full-bleed"></section></div>
  `,
  controller: GoogleMapController,
  transclude: true,
  bindings: {
    selected: '<',
    data: '<',
  }
});

function GoogleMapController($element, $timeout) {
  this.data = this.data || undefined;
  this.map = undefined;
  this.markers = [];
  this.selected = this.selected || undefined;
  this.defaultMarker = {lat: 37.7931154, lng: -122.4165049};

  this.$onInit = () => {
    $timeout(()=> {
      this.initMap();
    }, 2000);
  };

  this.$onChanges = (changes) => {

    if(changes.selected && changes.selected.currentValue){
      console.log(changes.selected.currentValue);
      this.setCenter();
    }
    if(changes.data && changes.data.currentValue){
      this.data = changes.data.currentValue;
      this.makeMarkers();
    }
  };

  this.initMap = () => {
    this.map = new google.maps.Map($element.find('section')[0], {
      zoom: 14,
      scrollwheel: false,
      navigationControl: false,
      mapTypeControl: false,
      scaleControl: false,
      draggable: false,
      center: this.defaultMarker,
      styles: [
        {
          featureType: "administrative",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#444444"
            }
          ]
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [
            {
              color: "#f2f2f2"
            }
          ]
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "all",
          stylers: [
            {
              saturation: -100
            },
            {
              lightness: 45
            }
          ]
        },
        {
          featureType: "road.highway",
          elementType: "all",
          stylers: [
            {
              visibility: "simplified"
            }
          ]
        },
        {
          featureType: "road.arterial",
          elementType: "labels.icon",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [
            {
              color: "#46bcec"
            },
            {
              visibility: "on"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "geometry.fill",
          stylers: [
            {
              color: "#cbd4ae"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#a1ab82"
            }
          ]
        }
      ]
    });
    this.makeMarkers();
  };

  this.setCenter = () => {
    console.log('center', this.selected.pos.lat, this.selected.pos.lng)
    this.map.setCenter(new google.maps.LatLng(this.selected.pos.lat, this.selected.pos.lng));
  };

  this.setMapOnAll = (map) => {
    if(!this.markers.length) return;
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].marker.setMap(map);
    }
  };

  this.makeMarkers = () => {
    this.setMapOnAll(null);
    this.markers = this.data.map((i, idx) => {
      return {
        data: i,
        info: new google.maps.InfoWindow({
          content: `<a href="#">${i.name}</a>`
        }),
        marker: new google.maps.Marker({
          position: i.pos,
          map: this.map,
          title: `${i.name}`,
          icon: `../images/_markers/marker-${idx+1}.png`
        })
      };
    });

    this.listeners = this.markers.map(i => {

      i.marker.addListener('click', ()=> {
        i.info.open(this.map, i.marker);
      });
    });

  }
}

module.component('placeItem', {
  templateUrl: 'attraction/place-item.html',
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
module.component('attractionComponent', {
  templateUrl:'./attraction/index.html',
  controller: AttractionController,
});

function AttractionController($scope) {
  this.filteredPlacesList = [];

  this.filterList = [
    {name: 'Restaurant', active: true},
    {name: 'Cafe', active: true},
    {name: 'Outdoor', active: true},
    {name: 'Entertainment', active: true},
    {name: 'Activity', active: true},
    {name: 'Bar', active: true}
  ];

  this.places = [
    {name: 'Bernal Heights Park', desc: 'Our favorite San Francisco vantage point', categories: ['Outdoors'], pos: {lat: 37.7433416, lng:-122.416179}},
    {name: 'Zero Zero', desc: 'Where we first met', categories: ['Restaurant'], pos: {lat: 37.7816139, lng: -122.4041343}},
    {name: 'Trouble Coffee + General Store', desc: 'Ultimate hipster experience near the ocean', categories: ['Cafe', 'Activity'], pos: {lat: 37.7602832, lng: -122.5076744}},
    {name: 'Mission Chinese', desc: 'Hot hot, american chinese fusion', categories: ['Restaurant'], pos: {lat: 37.7611967, lng: -122.4218593}},
    {name: 'Iza Ramen', desc: 'The best ramen outside of Japan', categories: ['Restaurant'], pos: {lat: 37.7717432, lng: -122.4325963}},
    {name: 'Flora Grubb', desc: 'Coffee, nature, heated benches for your butt', categories: ['Cafe', 'Outdoor'], pos: {lat: 37.7397158, lng: -122.3924253}},
    {name: 'Philz Coffee + Minnesota Steer project', desc: 'Get local coffee, get local art', categories: ['Cafe','Activity'], pos: {lat: 37.7543081, lng: -122.3918969}},
    {name: 'SpeakEasy', desc: 'Get drunk, gamble, and live in 1920s', categories: ['Activity','Bar','Entertainment'], pos: {lat: -25.363, lng: 13.044}},
    {name: 'Keiko A Nob Hill', desc: 'If you have money to burn, best food you\'ll ever have', categories: ['Restaurant'], pos: {lat: 37.7931154, lng: -122.4165049}},
    {name: 'Piccino', desc: 'Go for brunch, get a pizza', categories: ['Cafe', 'Restaurant'], pos: {lat: 37.7576742, lng: -122.3922757}},
    {name: 'Basa', desc: 'Best $8 sushi & poke', categories: ['Restaurant'], pos: {lat: 37.7527362, lng: -122.4155737}},
    {name: 'Farmhouse', desc: 'Best Thai food with pretentious interior', categories: ['Restaurant'], pos: {lat: 37.7602217, lng: -122.4134743}},
    {name: 'Nihon Whiskey', desc: 'Must go for whiskey lovers', categories: ['Bar'], pos: {lat: 37.7686563, lng: -122.4176993}},
    {name: 'Limon Rotisserie', desc: 'Do yourself a favor and just get chicken & ceviche', categories: ['Restaurant'], pos: {lat: 37.7570572, lng: -122.4187627}},
    {name: 'Alcatraz', desc: 'We haven\'t been but everyon says it\'s cool ¯\_(ツ)_/¯', categories: ['Activity'], pos: {lat: 37.8269817, lng: -122.4251442}},
    {name: 'La Taqueria', desc: 'Best taco in San Francisco', categories: ['Restaurant'], pos: {lat: 37.7509003, lng:-122.4202754}},
    {name: 'UtoEpia', desc: 'Get a massage, experience uTOEpia', categories: ['Activity'], pos: {lat: 37.7856572, lng:-122.4419387}},
    {name: 'Golden Gate Park', desc: 'Get lost, it\'s big, and rid a Segway', categories: ['Outdoor'], pos: {lat: 37.7694246, lng:-122.4882001}},
    {name: 'SFMoMA', desc: 'The only decent art museum in San Francisco', categories: ['Activity'], pos: {lat: 37.7857224, lng:-122.4032395}},
    {name: 'Neighbor bakehouse', desc: 'Ditch Tartine, this one\'s better. Go early, or they sell out', categories: ['Cafe'], pos: {lat: 37.7596337, lng: -122.3903614}},
    {name: 'House of Air', desc: 'Trampolines with a view', categories: ['Activity'], pos: {lat: 37.8049099, lng: -122.4710101}},
    {name: 'ASIASF', desc: 'Alternative entertainment', categories: ['Entertainment', 'Bar', 'Restaurant'], pos: {lat: 37.7750472, lng: -122.4150207}},
    {name: 'Dolores Park', desc: 'Meet weirdos', categories: ['Outdoor'], pos: {lat: 37.759621, lng:-122.4290978}},
    {name: 'Noeteca', desc: 'Freshest French-inspired brunch', categories: ['Restaurant'], pos: {lat: 37.7445525, lng:-122.4264169}},
    {name: 'Trolley', desc: 'Easiest way to become a stereotypical tourist', categories: ['Activity'], pos: {lat: 37.7850522, lng:-122.4083314}},
    {name: 'Eiji', desc: 'Needs copy', categories: ['Activity'], pos: {lat:37.7640753, lng:-122.4328633}},
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
    const doesPlaceIncludeName = (place, name) => place.categories.includes(name);

    let finalFilter = this.places
      .filter(place => removeFalse(this.filterList)
        .map(getFilterByName)
        .some(name => doesPlaceIncludeName(place, name)));

    if(finalFilter.length > 0 ) {
      this.filteredPlacesList = finalFilter;
    } else {
      this.resetFilters();
    }
  }
}

module.component('visitComponent', {
  templateUrl:'./visit/index.html',
  controller: VisitController,
});

function VisitController() {
  this.places = [
    {name: 'San Francisco City Hall', desc: 'Our favorite San Francisco vantage point',link: 'https://goo.gl/maps/33KAL4uih972', categories: ['Outdoors'], pos: {lat: 37.7792639, lng:-122.4214586}},
    {name: 'Trou Normand', desc: 'Where we first met', categories: ['Restaurant'],link: 'https://goo.gl/maps/nnNeSH7ZdVx', pos: {lat: 37.7866685, lng: -122.4019677}},
    {name: 'Monroe', desc: 'Ultimate hipster experience near the ocean', categories: ['Cafe', 'Activity'],link: 'https://goo.gl/maps/EQpnyvbU6DL2', pos: {lat: 37.7979009, lng: -122.4071291}}
  ]
}
