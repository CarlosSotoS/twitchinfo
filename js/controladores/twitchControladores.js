var Ctrl = (function(){
	//id del cliente, necesario para realizar peticiones a la API
	var clientId = "77j5cesl781f4gpduf1278i38j8icr1";
	
	//función controladora de la vista de canales más vistos
	var _mostViewersCtrl = function($scope,$http,$log){
		$http.get("https://api.twitch.tv/kraken/streams?client_id="+clientId)
			.success(function(info){
				$scope.streams = info.streams;
			})
			.error(function(err){
				$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
			});
		$scope.column = 'viewers';
		$scope.direction = 'false';
		$scope.order = function(column){
			if(column != $scope.column){
				$scope.column = column;
				$scope.direction = false;
			}else{
				$scope.direction = !$scope.direction;
			}
		}
	};
	//función controladora de la vista de canales
	var _channelCtrl = function($scope,$http,$routeParams,$log){
		$scope.toggleFavs = function(canal,display){
			if(localStorage.length == 0 || !localStorage.getItem(canal)){
				localStorage.setItem(canal,canal);
				window.alert("Canal de "+display+" añadido a favoritos");
				$scope.btnFavTxt = 'Quitar de';
			}
			else{
				localStorage.removeItem(canal);				
				window.alert("Canal de "+display+" eliminado de favoritos");
				$scope.btnFavTxt = 'Añadir a';
			}
		}
		$http.get("https://api.twitch.tv/kraken/channels/"+$routeParams.canal+"?client_id="+clientId)
			.success(function(channel){
				$scope.channel = channel;
				$scope.favorite = localStorage.getItem($scope.channel.name);
				$scope.btnFavTxt = $scope.favorite ? 'Quitar de' : 'Añadir a';
				$http.get("https://api.twitch.tv/kraken/streams/"+$routeParams.canal+"?client_id="+clientId)
					.success(function(info){
						$scope.stream = info.stream;
					})
					.error(function(err){
						$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
					});
				$scope.offset = parseInt($routeParams.offset) || 1;
				$scope.anterior = {};
				$scope.siguiente = {};
				$scope.anterior.link = false;
				$scope.siguiente.link = false;
				$http.get("https://api.twitch.tv/kraken/channels/"+$routeParams.canal+"/videos?broadcast_type=archive&broadcasts=true&limit=20&offset="+($scope.offset-1)*20+"&client_id="+clientId)
					.success(function(vidInfo){
						$scope.info = vidInfo;
						$scope.videos = vidInfo.videos;
						$scope.links = vidInfo._links;
						if($scope.links.prev){
							$scope.anterior.link = true;
							$scope.anterior.offset = $scope.offset-1<=1 ? '' : $scope.offset-1;
						}
						$http.get($scope.links.next+"&client_id="+clientId)
							.success(function(nextInfo){
								if(nextInfo.videos.length!=0){
									$scope.siguiente.link = true;
									$scope.siguiente.offset = $scope.offset+1;
								}
							})
							.error(function(err){
								$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
							});
					})
					.error(function(err){
						$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
					});
				$http.get("https://api.twitch.tv/kraken/chat/"+$routeParams.canal+"/badges")
					.success(function(badges){
						$scope.susImg = badges.subscriber.image;
					})
					.error(function(err){
						$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
					});
			})
			.error(function(err){
				$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
			});
	};
	
	//función controladora de la vista de juegos
	var _gameCtrl = function($scope,$http,$routeParams,$log){
		$scope.offset = parseInt($routeParams.offset) || 1;
		$scope.juego = $routeParams.juego;
		$scope.anterior = {};
		$scope.siguiente = {};
		$scope.anterior.link = false;
		$scope.siguiente.link = false;
		$http.get("https://api.twitch.tv/kraken/streams?limit=20&offset="+($scope.offset-1)*20+"&game="+$scope.juego+"&client_id="+clientId)
			.success(function(info){
				$scope.streams = info.streams;
				$scope.links = info._links;
				if($scope.links.prev){
					$scope.anterior.link = true;
					$scope.anterior.offset = $scope.offset-1<=1 ? '' : $scope.offset-1;
				}
				$http.get($scope.links.next+"&client_id="+clientId)
					.success(function(nextInfo){
						if(nextInfo.streams.length!=0){
							$scope.siguiente.link = true;
							$scope.siguiente.offset = $scope.offset+1;
						}
					})
					.error(function(err){
						$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
					});
			})
			.error(function(err){
				$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
			});
		$scope.order = function(column){
			if(column != $scope.column){
				$scope.column = column;
				$scope.direction = false;
			}else{
				$scope.direction = !$scope.direction;
			}
		}
	};
	
	//función controladora de la vista de búsqueda por juego
	var _schGamesCtrl = function($scope,$http,$routeParams,$log){
		$scope.query = $routeParams.busqueda;
	    $http.get("https://api.twitch.tv/kraken/search/games?q="+$scope.query+"&client_id="+clientId+"&type=suggest")
			.success(function(info){
				if(info.games.length){
					$scope.games = info.games;
					$log.log($scope.games);
					$scope.games.forEach(function(game){
						$http.get("https://api.twitch.tv/kraken/streams/summary?game="+game.name+"&client_id="+clientId)
						.success(function(summary){
							game.viewers = summary.viewers;
							game.palabra = summary.viewers >1 ? "espectadores" : "espectador";
						})
						.error(function(err){
							game.viewers = 0;
							game.palabra = "espectadores";
							$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
						});
					})
				}
			})
			.error(function(err){
				$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
			});
	};
	
	//función controladora de la vista de búsqueda por canales
	var _schChansCtrl = function($scope,$http,$routeParams,$log){
		$scope.offset = parseInt($routeParams.offset) || 1;
		$scope.query = $routeParams.busqueda;
		$scope.anterior = {};
		$scope.siguiente = {};
		$scope.anterior.link = false;
		$scope.siguiente.link = false;
		$http.get("https://api.twitch.tv/kraken/search/channels?limit=20&offset="+($scope.offset-1)*20+"&q="+$scope.query+"&client_id="+clientId)
			.success(function(info){
				if(info._total){
					$scope.channels = info.channels;
					$scope.links = info._links;
					if($scope.links.prev){
						$scope.anterior.link = true;
						$scope.anterior.offset = $scope.offset-1<=1 ? '' : $scope.offset-1;
					}
					$http.get($scope.links.next+"&client_id="+clientId)
						.success(function(nextInfo){
							if(nextInfo.channels.length!=0){
								$scope.siguiente.link = true;
								$scope.siguiente.offset = $scope.offset+1;
							}
						})
						.error(function(err){
							$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
						});
					$scope.channels.forEach(function(channel){
						$http.get("https://api.twitch.tv/kraken/streams/"+channel.display_name+"?client_id="+clientId)
							.success(function(streamInfo){
								if (streamInfo.stream != null){
									channel.stream = "Hay canal";
								}else{
									channel.stream = null;
								}
							})
							.error(function(err){
								$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
							});
					})
				}
			})
			.error(function(err){
				$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
			});
		$scope.order = function(column){
			if(column != $scope.column){
				$scope.column = column;
				$scope.direction = false;
			}else{
				$scope.direction = !$scope.direction;
			}
		}
	};
	
	//función controladora de la vista de búsqueda por canales emitiendo actualmente
	var _schStrmsCtrl = function($scope,$http,$routeParams,$log){
		$scope.offset = parseInt($routeParams.offset) || 1;
		$scope.query = $routeParams.busqueda;
		$scope.anterior = {};
		$scope.siguiente = {};
		$scope.anterior.link = false;
		$scope.siguiente.link = false;
		$http.get("https://api.twitch.tv/kraken/search/streams?limit=20&offset="+($scope.offset-1)*20+"&q="+$scope.query+"&client_id="+clientId)
			.success(function(info){
				if(info._total){
					$scope.streams = info.streams;
					$scope.links = info._links;
					if($scope.links.prev){
						$scope.anterior.link = true;
						$scope.anterior.offset = $scope.offset-1<=1 ? '' : $scope.offset-1;
					}
					$http.get($scope.links.next+"&client_id="+clientId)
						.success(function(nextInfo){
							if(nextInfo.streams.length!=0){
								$scope.siguiente.link = true;
								$scope.siguiente.offset = $scope.offset+1;
							}
						})
						.error(function(err){
							$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
						});
				}
			})
			.error(function(err){
				$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
			});
		$scope.order = function(column){
			if(column != $scope.column){
				$scope.column = column;
				$scope.direction = false;
			}else{
				$scope.direction = !$scope.direction;
			}
		}
	}
	
	//función controladora de la vista del visor de canales
	var _visorCtrl = function($scope,$http,$routeParams,$log){		
		$scope.toggleFavs = function(canal,display){
			if(localStorage.length == 0 || !localStorage.getItem(canal)){
				localStorage.setItem(canal,canal);
				window.alert("Canal de "+display+" añadido a favoritos");
				$scope.btnFavTxt = 'Quitar de';
			}
			else{
				localStorage.removeItem(canal);				
				window.alert("Canal de "+display+" eliminado de favoritos");
				$scope.btnFavTxt = 'Añadir a';
			}
		}
		$http.get("https://api.twitch.tv/kraken/channels/"+$routeParams.canal+"?client_id="+clientId)
			.success(function(channel){
				$scope.channel = channel;
				$scope.favorite = localStorage.getItem($scope.channel.name);
				$scope.btnFavTxt = $scope.favorite ? 'Quitar de' : 'Añadir a';
				$http.get("https://api.twitch.tv/kraken/streams/"+$routeParams.canal+"?client_id="+clientId)
				.success(function(info){
					$scope.info = info;
					$scope.stream = info.stream;
				})
				.error(function(err){
					$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
				});
			})
			.error(function(err){
				$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
			});
	};
	
	//función controladora de la vista de canales favoritos
	var _favCtrl = function($scope,$http,$log){
		$scope.channels = [];
		if(localStorage.length!=0){
			for (var i = 0; i < localStorage.length; i++){
			    canal = localStorage.getItem(localStorage.key(i));
			    $http.get("https://api.twitch.tv/kraken/channels/"+canal+"?client_id="+clientId)
				.success(function(channel){
					$http.get("https://api.twitch.tv/kraken/streams/"+channel.display_name+"?client_id="+clientId)
						.success(function(streamInfo){
							if (streamInfo.stream != null){
								channel.stream = "Hay canal";
							}else{
								channel.stream = null;
							}
						})
						.error(function(err){
							$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
						});
					$scope.channels.push(channel);
				})
				.error(function(err){
					$log.log("Fallo en la petición AJAX " + err.code + "--" +err.message);
				});
			}
		}
		$scope.removeFavs = function(canal){
			localStorage.removeItem(canal);
			$('#'+canal).remove();
		}
		$scope.column = "name";
		$scope.order = function(column){
			if(column != $scope.column){
				$scope.column = column;
				$scope.direction = false;
			}else{
				$scope.direction = !$scope.direction;
			}
		}
	};

	return{
		mostViewersCtrl: _mostViewersCtrl,
		channelCtrl: _channelCtrl,
		gameCtrl: _gameCtrl,
		schChansCtrl: _schChansCtrl,
		schGamesCtrl: _schGamesCtrl,
		schStrmsCtrl: _schStrmsCtrl,
		visorCtrl: _visorCtrl,
		favCtrl: _favCtrl
	}
})();