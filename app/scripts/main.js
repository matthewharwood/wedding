const module = angular.module('app', ['ui.router']);

module.config(Config);

Config.$inject = ['$urlRouterProvider', '$stateProvider'];
function Config($urlRouterProvider, $stateProvider) {
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
    name: 'accommodations',
    url: '/accommodations',
    template: '<accommodations-component></accommodations-component>',
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
}

function HomeController() {
  this.$onInit = () => {
     const navMain = $(".navbar-collapse"); // avoid dependency on #id
     // "a:not([data-toggle])" - to avoid issues caused
     // when you have dropdown inside navbar
     navMain.on("click", "a:not([data-toggle])", null, function () {
         navMain.collapse('hide');
     });
  }
  this.places = [
    {name: 'Ceremony: San Francisco City Hall', link: 'https://goo.gl/maps/33KAL4uih972', categories: ['Outdoors'], pos: {lat: 37.7792639, lng:-122.4214586}},
    {name: 'Reception: Trou Normand',  categories: ['Restaurant'],link: 'https://goo.gl/maps/nnNeSH7ZdVx', pos: {lat: 37.7866599, lng: -122.3999723}},
    {name: 'After party: Monroe', categories: ['Cafe', 'Activity'],link: 'https://goo.gl/maps/EQpnyvbU6DL2', pos: {lat: 37.7984859, lng: -122.405144}}
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

GoogleMapController.$inject = ['$element', '$timeout'];
function GoogleMapController($element, $timeout) {
  this.data = this.data || undefined;
  this.map = undefined;
  this.markers = [];
  this.selected = this.selected || undefined;
  this.defaultMarker = {lat: 37.7931154, lng: -122.4165159};

  this.$onInit = () => {

    $timeout(()=> {
      this.initMap();
    }, 2000);
  };

  this.$onChanges = (changes) => {

    if(changes.selected && changes.selected.currentValue){
      this.setCenter();
      this.openInfo(changes.selected.currentValue);
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
      draggable: true,
      center: this.defaultMarker,
      styles: [
        {
          featureType: 'administrative',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#444444'
            }
          ]
        },
        {
          featureType: 'landscape',
          elementType: 'all',
          stylers: [
            {
              color: '#f2f2f2'
            }
          ]
        },
        {
          featureType: 'poi',
          elementType: 'all',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'road',
          elementType: 'all',
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
          featureType: 'road.highway',
          elementType: 'all',
          stylers: [
            {
              visibility: 'simplified'
            }
          ]
        },
        {
          featureType: 'road.arterial',
          elementType: 'labels.icon',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'transit',
          elementType: 'all',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'water',
          elementType: 'all',
          stylers: [
            {
              color: '#46bcec'
            },
            {
              visibility: 'on'
            }
          ]
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#cbd4ae'
            }
          ]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#a1ab82'
            }
          ]
        }
      ]
    });
    this.makeMarkers();
  };

  this.setCenter = () => {
    console.log(this.selected);
    this.map.panTo(new google.maps.LatLng(this.selected.pos.lat, this.selected.pos.lng));
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
          content: `
            <div class="map-tooltip">
                <h6>${i.name}</h6>
                <a target="_blank" href="${i.link}">View in Google Maps</a>
            </div>
          `
        }),
        marker: new google.maps.Marker({
          position: i.pos,
          map: this.map,
          title: `${i.name}`,
          icon: `../images/_markers/marker-${idx+1}.png`
        })
      };
    });

    this.openInfo = (i)=> {
      this.markers.map(x => x.info.close());
      let [mark] = this.markers.filter(m => {
        return m.marker.title === this.selected.name;
      });

      mark.info.open(this.map, mark.marker);
    };

    this.listeners = this.markers.map(i => {
      i.marker.addListener('click', ()=> {
        this.markers.map(x => x.info.close());
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
    index: '<',
    selected: '&'
  }
});

function PlaceItemController() {
  this.data = this.data || undefined;
  this.filters = this.filters || undefined;
  this.selected = this.selected || undefined;
  this.item = this.item || undefined;
}
module.component('attractionComponent', {
  templateUrl:'./attraction/index.html',
  controller: AttractionController,
});

function AttractionController() {
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
    {name: 'Bernal Heights Park', desc: 'Our favorite San Francisco vantage point', categories: ['Outdoors'], pos: {lat: 37.7433416, lng:-122.416179}, link: 'https://goo.gl/maps/zMv5Z18WsAq'},
    {name: 'Zero Zero', desc: 'Where we first met', categories: ['Restaurant'], pos: {lat: 37.7816139, lng: -122.4041343}, link: 'https://goo.gl/maps/UkDKgPy8dKt'},
    {name: 'General Store + Trouble Coffee ', desc: 'Ultimate hipster experience near the ocean', categories: ['Cafe', 'Activity'], pos: {lat: 37.7602832, lng: -122.5076744}, link: 'https://goo.gl/maps/VvVzBa1WtSC2'},
    {name: 'Mission Chinese', desc: 'Hot hot, american chinese fusion', categories: ['Restaurant'], pos: {lat: 37.7611967, lng: -122.4218593}, link: 'https://goo.gl/maps/cbWHGrrNQbE2'},
    {name: 'Iza Ramen', desc: 'The best ramen in San Francisco', categories: ['Restaurant'], pos: {lat: 37.7717432, lng: -122.4325963}, link: 'https://goo.gl/maps/KX5aB6v4Ri92'},
    {name: 'Flora Grubb', desc: 'Coffee, nature, heated benches for your butt', categories: ['Cafe', 'Outdoor'], pos: {lat: 37.7397158, lng: -122.3924253}, link: 'https://goo.gl/maps/NkhvAfPtjbD2'},
    {name: 'Minnesota Street project + Philz Coffee ', desc: 'Get local art, get local coffee', categories: ['Cafe','Activity'], pos: {lat: 37.7543081, lng: -122.3918969}, link: 'https://goo.gl/maps/BYbemCu6tK22'},
    {name: 'Keiko à Nob Hill', desc: 'Expensive but the best food you\'ll ever have', categories: ['Restaurant'], pos: {lat: 37.7931154, lng: -122.4165049}, link: 'https://goo.gl/maps/Nvo2uKjqsUL2'},
    {name: 'Piccino', desc: 'Go for brunch, get a pizza', categories: ['Cafe', 'Restaurant'], pos: {lat: 37.7576742, lng: -122.3922757}, link: 'https://goo.gl/maps/syPgrSB875K2'},
    {name: 'Basa', desc: 'Best $8 sushi & poke', categories: ['Restaurant'], pos: {lat: 37.7527362, lng: -122.4155737}, link: 'https://goo.gl/maps/3ztAGYmexBG2'},
    {name: 'Farmhouse', desc: 'Best Thai food with pretentious interior', categories: ['Restaurant'], pos: {lat: 37.7602217, lng: -122.4134743}, link: 'https://goo.gl/maps/qENv5m3XUv32'},
    {name: 'Nihon Whiskey', desc: 'Must go for whiskey lovers', categories: ['Bar'], pos: {lat: 37.7686563, lng: -122.4176993}, link: 'https://goo.gl/maps/w1i53dcJ8a82'},
    {name: 'Limón Rotisserie', desc: 'Do yourself a favor and get chicken & ceviche', categories: ['Restaurant'], pos: {lat: 37.7570572, lng: -122.4187627}, link: 'https://goo.gl/maps/SmdtmpgH7GU2'},
    {name: 'Alcatraz', desc: 'We haven\'t been but everyone says it\'s cool', categories: ['Activity'], pos: {lat: 37.8269817, lng: -122.4251442}, link: 'https://goo.gl/maps/hmn1iCjRkNo'},
    {name: 'La Taqueria', desc: 'Best taco in San Francisco', categories: ['Restaurant'], pos: {lat: 37.7509003, lng:-122.4202754}, link: 'https://goo.gl/maps/vgAyPHfx6gR2'},
    {name: 'UtoEpia', desc: 'Get a massage, experience uTOEpia', categories: ['Activity'], pos: {lat: 37.7856572, lng:-122.4419387}, link: 'https://goo.gl/maps/tJhkNnE4GXR2'},
    {name: 'Golden Gate Park', desc: 'It\'s big, get lost, and ride a Segway', categories: ['Outdoor'], pos: {lat: 37.7694246, lng:-122.4882001}, link: 'https://goo.gl/maps/PCrXcvrjx5P2'},
    {name: 'SFMoMA', desc: 'The only decent art museum in San Francisco', categories: ['Activity'], pos: {lat: 37.7857224, lng:-122.4032395}, link: 'https://goo.gl/maps/Esbu4ahZprA2'},
    {name: 'Neighbor bakehouse', desc: 'Ditch Tartine, this one\'s better. Go early, or they sell out', categories: ['Cafe'], pos: {lat: 37.7596337, lng: -122.3903614}, link: 'https://goo.gl/maps/6ZKr6pEMkWM2'},
    {name: 'House of Air', desc: 'Trampolines with an ocean view', categories: ['Activity'], pos: {lat: 37.8049099, lng: -122.4710101}, link: 'https://goo.gl/maps/mRcKhZpEpg22'},
    {name: 'ASIASF', desc: 'Alternative entertainment', categories: ['Entertainment', 'Bar', 'Restaurant'], pos: {lat: 37.7750472, lng: -122.4150207}, link: 'https://goo.gl/maps/C4HG8wVbS9z'},
    {name: 'Dolores Park', desc: 'Meet the weirdos', categories: ['Outdoor'], pos: {lat: 37.759621, lng:-122.4290978}, link: 'https://goo.gl/maps/E8So63LnmSC2'},
    {name: 'Noeteca', desc: 'Freshest French-inspired brunch', categories: ['Restaurant'], pos: {lat: 37.7445525, lng:-122.4264169}, link: 'https://goo.gl/maps/wTzrvNURyDM2'},
    {name: 'Trolley', desc: 'Fastest way to become a stereotypical tourist', categories: ['Activity'], pos: {lat: 37.7850522, lng:-122.4083314}, link: 'https://goo.gl/maps/BMHKPGWSPpS2'},
    {name: 'Eiji', desc: 'Legit Japanese food, get strawberry mochi dessert', categories: ['Activity'], pos: {lat:37.7640753, lng:-122.4328633}, link: 'https://goo.gl/maps/2WWAJQMUuyJ2'},
  ];

  this.$onInit = () => {

    this.resetFilters();
  };

  this.switchSize = () => {

    return (window.innerWidth <= 768);
  }


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

module.component('accommodationsComponent', {
  templateUrl:'./accommodations/index.html',
  controller: AccommodationsController,
});

function AccommodationsController() {
  this.$onInit = () => {
     const navMain = $(".navbar-collapse"); // avoid dependency on #id
     // "a:not([data-toggle])" - to avoid issues caused
     // when you have dropdown inside navbar
     navMain.on("click", "a:not([data-toggle])", null, function () {
         navMain.collapse('hide');
     });
  }
}

module.component('countDownComponent', {
  template: ' <div class="pl-3">Happening in {{$ctrl.diffDays}} days {{$ctrl.hoursLeft}} hours {{$ctrl.minsLeft}} minutes {{$ctrl.secondsLeft}} seconds</div>',
  controller: CountDownController
});
CountDownController.$inject = ['$interval'];
function CountDownController($interval) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const oneDay = 24*60*60*1000;
  const firstDate = new Date();
  const secondDate = new Date('5/25/2017');


  this.diffInDays = (a, b) => {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  };

  this.$onInit = () => {
    this.diffDays = this.diffInDays(firstDate, secondDate);
    this.hoursLeft = firstDate.getHours();
    this.minsLeft = firstDate.getMinutes();
    this.secondsLeft = firstDate.getSeconds();

    $interval(()=> {
      const quickDate = new Date();
      this.secondsLeft = -quickDate.getSeconds() + 60;
      this.minsLeft = -quickDate.getMinutes() + 60;
      this.hoursLeft = -quickDate.getHours() + 24;
    },1000)
  }
}
