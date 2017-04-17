//declaración del módulo y barra de navegación
var twitchModule = angular.module('twitchApp',['ngRoute'])
	.directive('miNavbar', function () {
		return {
			template: '<nav class="navbar navbar-inverse navbar-fixed-top">'
			+	'<div class="container-fluid">'
			+		'<div class="navbar-header">'
			+			'<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">'
			+				'<span class="icon-bar"></span>'
			+				'<span class="icon-bar"></span>'
			+				'<span class="icon-bar"></span>'
			+			'</button>'
			+			'<a class="navbar-brand" href="#/">Twitch Information</a>'
			+		'</div>'
			+		'<div class="collapse navbar-collapse" id="myNavbar">'
			+			'<ul class="nav navbar-nav">'
			+				'<li>'
			+					'<input type="text" ng-model="busqueda" class="form-control" placeholder="Búsqueda">'
			+				'</li>'
			+				'<li>'
			+					'<a href="#/juegos/{{busqueda}}"><button type="button">Por Juegos</button></a>'
			+				'</li>'
			+				'<li>'
			+					'<a href="#/canales/{{busqueda}}"><button type="button">Por Canales</button></a>'
			+				'</li>'
			+				'<li>'
			+					'<a href="#/streams/{{busqueda}}"><button type="button">Por Streams</button></a>'
			+				'</li>'
			+			'</ul>'
			+			'<ul class="nav navbar-nav navbar-right">'
			+				'<li>'
			+					'<a href="#/favoritos"><span class="glyphicon glyphicon-star"></span><span class="fav">Favoritos</a>'
			+				'</li>'
			+			'</ul>'
			+		'</div>'
			+	'</div>'
			+'</nav>'
		}
	}
);

  

//RouteProvider para cargar las vistas y los controladores
twitchModule.config(['$routeProvider',function($routeProvider){
	$routeProvider.
		when("/",{
			templateUrl: "vistas/masVistos.html",
			controller: Ctrl.mostViewersCtrl
		}).
		when("/canal/:canal/:offset?",{
			templateUrl: "vistas/canal.html",
			controller: Ctrl.channelCtrl
		}).
		when("/canales/:busqueda/:offset?",{
			templateUrl: "vistas/canales.html",
			controller: Ctrl.schChansCtrl
		}).
		when("/juego/:juego/:offset?",{
			templateUrl: "vistas/juego.html",
			controller: Ctrl.gameCtrl
		}).
		when("/juegos/:busqueda",{
			templateUrl: "vistas/juegos.html",
			controller: Ctrl.schGamesCtrl
		}).
		when("/streams/:busqueda/:offset?",{
			templateUrl: "vistas/streams.html",
			controller: Ctrl.schStrmsCtrl
		}).
		when("/visor/:canal/:offset?",{
			templateUrl: "vistas/visor.html",
			controller: Ctrl.visorCtrl
		}).
		when("/favoritos",{
			templateUrl: "vistas/favoritos.html",
			controller: Ctrl.favCtrl
		}).
		otherwise({
			redirectTo: "/"
		})
}])
