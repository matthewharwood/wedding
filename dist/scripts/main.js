"use strict";function Run(e){e.$on("$stateChangeSuccess",function(){document.body.scrollTop=document.documentElement.scrollTop=0})}function Config(e,t){var o=[];e.when("","/"),o.push({name:"home",url:"/",templateUrl:"./home/index.html",controller:HomeController,controllerAs:"$ctrl"}),o.push({name:"accommodations",url:"/accommodations",template:"<accommodations-component></accommodations-component>"}),o.push({name:"attraction",url:"/attraction",template:"<attraction-component></attraction-component>"}),o.push({name:"photo",url:"/photo",templateUrl:"./photo/index.html"}),o.forEach(function(e){return t.state(e)})}function HomeController(){this.$onInit=function(){var e=$(".navbar-collapse");e.on("click","a:not([data-toggle])",null,function(){e.collapse("hide")})},this.places=[{name:"Ceremony: San Francisco City Hall",link:"https://goo.gl/maps/33KAL4uih972",categories:["Outdoors"],pos:{lat:37.7792639,lng:-122.4214586}},{name:"Reception: Trou Normand",categories:["Restaurant"],link:"https://goo.gl/maps/nnNeSH7ZdVx",pos:{lat:37.7866599,lng:-122.3999723}},{name:"After party: Monroe",categories:["Cafe","Activity"],link:"https://goo.gl/maps/EQpnyvbU6DL2",pos:{lat:37.7984859,lng:-122.405144}}]}function FilterButtonsController(){this.data=this.data||void 0}function GoogleMapController(e,t){var o=this;this.data=this.data||void 0,this.map=void 0,this.markers=[],this.selected=this.selected||void 0,this.defaultMarker={lat:37.7812962,lng:-122.4229687},this.$onInit=function(){t(function(){o.initMap()},2e3)},this.$onChanges=function(e){e.selected&&e.selected.currentValue&&(o.setCenter(),o.openInfo(e.selected.currentValue)),e.data&&e.data.currentValue&&(o.data=e.data.currentValue,o.makeMarkers())},this.initMap=function(){o.map=new google.maps.Map(e.find("section")[0],{zoom:13,scrollwheel:!1,navigationControl:!1,mapTypeControl:!1,scaleControl:!1,draggable:!0,center:o.defaultMarker,styles:[{featureType:"administrative",elementType:"labels.text.fill",stylers:[{color:"#444444"}]},{featureType:"landscape",elementType:"all",stylers:[{color:"#f2f2f2"}]},{featureType:"poi",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"all",stylers:[{saturation:-100},{lightness:45}]},{featureType:"road.highway",elementType:"all",stylers:[{visibility:"simplified"}]},{featureType:"road.arterial",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"all",stylers:[{color:"#46bcec"},{visibility:"on"}]},{featureType:"water",elementType:"geometry.fill",stylers:[{color:"#cbd4ae"}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{color:"#a1ab82"}]}]}),o.makeMarkers()},this.setCenter=function(){o.map.panTo(new google.maps.LatLng(o.selected.pos.lat,o.selected.pos.lng))},this.setMapOnAll=function(e){if(o.markers.length)for(var t=0;t<o.markers.length;t++)o.markers[t].marker.setMap(e)},this.makeMarkers=function(){o.setMapOnAll(null),o.markers=o.data.map(function(e,t){return{data:e,info:new google.maps.InfoWindow({content:'\n            <div class="map-tooltip">\n                <h6>'+e.name+'</h6>\n                <a target="_blank" href="'+e.link+'">View in Google Maps</a>\n            </div>\n          '}),marker:new google.maps.Marker({position:e.pos,map:o.map,title:""+e.name,icon:"../images/_markers/marker-"+(t+1)+".png"})}}),o.openInfo=function(e){o.markers.map(function(e){return e.info.close()});var t=o.markers.filter(function(e){return e.marker.title===o.selected.name}),n=_slicedToArray(t,1),a=n[0];a.info.open(o.map,a.marker)},o.listeners=o.markers.map(function(e){e.marker.addListener("click",function(){o.markers.map(function(e){return e.info.close()}),e.info.open(o.map,e.marker)})})}}function PlaceItemController(){this.data=this.data||void 0,this.filters=this.filters||void 0,this.selected=this.selected||void 0,this.item=this.item||void 0}function AttractionController(){var e=this;this.filteredPlacesList=[],this.filterList=[{name:"Restaurant",active:!0},{name:"Cafe",active:!0},{name:"Outdoor",active:!0},{name:"Entertainment",active:!0},{name:"Activity",active:!0},{name:"Bar",active:!0}],this.places=[{name:"Bernal Heights Park",desc:"Our favorite San Francisco vantage point",categories:["Outdoors"],pos:{lat:37.7433416,lng:-122.416179},link:"https://goo.gl/maps/zMv5Z18WsAq"},{name:"Zero Zero",desc:"Where we first met",categories:["Restaurant"],pos:{lat:37.7816139,lng:-122.4041343},link:"https://goo.gl/maps/UkDKgPy8dKt"},{name:"General Store + Trouble Coffee ",desc:"Ultimate hipster experience near the ocean",categories:["Cafe","Activity"],pos:{lat:37.7602832,lng:-122.5076744},link:"https://goo.gl/maps/VvVzBa1WtSC2"},{name:"Mission Chinese",desc:"Hot hot, american chinese fusion",categories:["Restaurant"],pos:{lat:37.7611967,lng:-122.4218593},link:"https://goo.gl/maps/cbWHGrrNQbE2"},{name:"Iza Ramen",desc:"The best ramen in San Francisco",categories:["Restaurant"],pos:{lat:37.7717432,lng:-122.4325963},link:"https://goo.gl/maps/KX5aB6v4Ri92"},{name:"Flora Grubb",desc:"Coffee, nature, heated benches for your butt",categories:["Cafe","Outdoor"],pos:{lat:37.7397158,lng:-122.3924253},link:"https://goo.gl/maps/NkhvAfPtjbD2"},{name:"Minnesota Street project + Philz Coffee ",desc:"Get local art, get local coffee",categories:["Cafe","Activity"],pos:{lat:37.7543081,lng:-122.3918969},link:"https://goo.gl/maps/BYbemCu6tK22"},{name:"Keiko à Nob Hill",desc:"Expensive but the best food you'll ever have",categories:["Restaurant"],pos:{lat:37.7931154,lng:-122.4165049},link:"https://goo.gl/maps/Nvo2uKjqsUL2"},{name:"Piccino",desc:"Go for brunch, get a pizza",categories:["Cafe","Restaurant"],pos:{lat:37.7576742,lng:-122.3922757},link:"https://goo.gl/maps/syPgrSB875K2"},{name:"Basa",desc:"Best $8 sushi & poke",categories:["Restaurant"],pos:{lat:37.7527362,lng:-122.4155737},link:"https://goo.gl/maps/3ztAGYmexBG2"},{name:"Farmhouse",desc:"Best Thai food with pretentious interior",categories:["Restaurant"],pos:{lat:37.7602217,lng:-122.4134743},link:"https://goo.gl/maps/qENv5m3XUv32"},{name:"Nihon Whiskey",desc:"Must go for whiskey lovers",categories:["Bar"],pos:{lat:37.7686563,lng:-122.4176993},link:"https://goo.gl/maps/w1i53dcJ8a82"},{name:"Limón Rotisserie",desc:"Do yourself a favor and get chicken & ceviche",categories:["Restaurant"],pos:{lat:37.7570572,lng:-122.4187627},link:"https://goo.gl/maps/SmdtmpgH7GU2"},{name:"Alcatraz",desc:"We haven't been but everyone says it's cool",categories:["Activity"],pos:{lat:37.8269817,lng:-122.4251442},link:"https://goo.gl/maps/hmn1iCjRkNo"},{name:"La Taqueria",desc:"Best taco in San Francisco",categories:["Restaurant"],pos:{lat:37.7509003,lng:-122.4202754},link:"https://goo.gl/maps/vgAyPHfx6gR2"},{name:"UtoEpia",desc:"Get a massage, experience uTOEpia",categories:["Activity"],pos:{lat:37.7856572,lng:-122.4419387},link:"https://goo.gl/maps/tJhkNnE4GXR2"},{name:"Golden Gate Park",desc:"It's big, get lost, and ride a Segway",categories:["Outdoor"],pos:{lat:37.7694246,lng:-122.4882001},link:"https://goo.gl/maps/PCrXcvrjx5P2"},{name:"SFMoMA",desc:"The only decent art museum in San Francisco",categories:["Activity"],pos:{lat:37.7857224,lng:-122.4032395},link:"https://goo.gl/maps/Esbu4ahZprA2"},{name:"Neighbor bakehouse",desc:"Ditch Tartine, this one's better. Go early, or they sell out",categories:["Cafe"],pos:{lat:37.7596337,lng:-122.3903614},link:"https://goo.gl/maps/6ZKr6pEMkWM2"},{name:"House of Air",desc:"Trampolines with an ocean view",categories:["Activity"],pos:{lat:37.8049099,lng:-122.4710101},link:"https://goo.gl/maps/mRcKhZpEpg22"},{name:"ASIASF",desc:"Alternative entertainment",categories:["Entertainment","Bar","Restaurant"],pos:{lat:37.7750472,lng:-122.4150207},link:"https://goo.gl/maps/C4HG8wVbS9z"},{name:"Dolores Park",desc:"Meet the weirdos",categories:["Outdoor"],pos:{lat:37.759621,lng:-122.4290978},link:"https://goo.gl/maps/E8So63LnmSC2"},{name:"Noeteca",desc:"Freshest French-inspired brunch",categories:["Restaurant"],pos:{lat:37.7445525,lng:-122.4264169},link:"https://goo.gl/maps/wTzrvNURyDM2"},{name:"Trolley",desc:"Fastest way to become a stereotypical tourist",categories:["Activity"],pos:{lat:37.7850522,lng:-122.4083314},link:"https://goo.gl/maps/BMHKPGWSPpS2"},{name:"Eiji",desc:"Legit Japanese food, get strawberry mochi dessert",categories:["Activity"],pos:{lat:37.7640753,lng:-122.4328633},link:"https://goo.gl/maps/2WWAJQMUuyJ2"}],this.$onInit=function(){e.resetFilters()},this.switchSize=function(){return window.innerWidth<=768},this.selected=function(t){e.currentMarker=t},this.resetFilters=function(){e.filteredPlacesList=e.places},this.output=function(){var t=function(e){return e.name},o=function(e){return e.filter(function(e){return e.active})},n=function(e,t){return e.categories.includes(t)},a=e.places.filter(function(a){return o(e.filterList).map(t).some(function(e){return n(a,e)})});a.length>0?e.filteredPlacesList=a:e.resetFilters()}}function AccommodationsController(){this.$onInit=function(){var e=$(".navbar-collapse");e.on("click","a:not([data-toggle])",null,function(){e.collapse("hide")})}}function CountDownController(e){var t=this,o=864e5,n=new Date,a=new Date("5/25/2017");this.diffInDays=function(e,t){var n=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate()),a=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate());return Math.floor((a-n)/o)},this.$onInit=function(){t.diffDays=t.diffInDays(n,a),t.hoursLeft=n.getHours(),t.minsLeft=n.getMinutes(),t.secondsLeft=n.getSeconds(),e(function(){var e=new Date;t.secondsLeft=-e.getSeconds()+60,t.minsLeft=-e.getMinutes()+60,t.hoursLeft=-e.getHours()+24},1e3)}}var _slicedToArray=function(){function e(e,t){var o=[],n=!0,a=!1,s=void 0;try{for(var r,i=e[Symbol.iterator]();!(n=(r=i.next()).done)&&(o.push(r.value),!t||o.length!==t);n=!0);}catch(e){a=!0,s=e}finally{try{!n&&i.return&&i.return()}finally{if(a)throw s}}return o}return function(t,o){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,o);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),_module=angular.module("app",["ui.router"]);_module.config(Config).run(Run),Run.$inject=["$rootScope"],Config.$inject=["$urlRouterProvider","$stateProvider"],_module.component("filterButtons",{templateUrl:"attraction/filter-buttons.html",controller:FilterButtonsController,bindings:{data:"=",output:"&"}}),_module.component("googleMap",{template:'\n    <ng-transclude></ng-transclude>\n    <div class="fixed-position full-bleed"><section class="full-bleed"></section></div>\n  ',controller:GoogleMapController,transclude:!0,bindings:{selected:"<",data:"<"}}),GoogleMapController.$inject=["$element","$timeout"],_module.component("placeItem",{templateUrl:"attraction/place-item.html",controller:PlaceItemController,bindings:{data:"<",filters:"<",index:"<",selected:"&"}}),_module.component("attractionComponent",{templateUrl:"./attraction/index.html",controller:AttractionController}),_module.component("accommodationsComponent",{templateUrl:"./accommodations/index.html",controller:AccommodationsController}),_module.component("countDownComponent",{template:' <div class="pl-3">Happening in {{$ctrl.diffDays}} days {{$ctrl.hoursLeft}} hours {{$ctrl.minsLeft}} minutes {{$ctrl.secondsLeft}} seconds</div>',controller:CountDownController}),CountDownController.$inject=["$interval"];