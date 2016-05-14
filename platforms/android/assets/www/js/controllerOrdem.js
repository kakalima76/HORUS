angular.module('starter.controllers')

.controller('numeroCtrl', ['$scope', '$http', '$q', '$ionicLoading', '$state', 'factoryAgente', function($scope, $http, $q, $ionicLoading, $state, factoryAgente){
	$scope.numero = 0;
	$scope.showMostrar = false;

	function busca(){
		return $q(function(resolve, reject){
			var numero = factoryAgente.getOrdem();
			if(numero){
			var body = {numero: numero}

						var promise = $http.post('http://ccuanexos.herokuapp.com/ordem/numero', body)
						$ionicLoading.show({template: 'Carregando...'});
						promise.then(function(data){
							$ionicLoading.hide();
							resolve(data)
						})
						.catch(function(err){
							$ionicLoading.hide();
							reject('Número inexistente');
						})
			}else{
				reject('Informe um número.');
			}
		})
	};

				function dataExtenso(data){
					var dia = data.substring(0,2);
					var mes = parseInt(data.substring(2,4));
					var ano = data.substring(4);
					var meses = ['', 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
					return dia +' de '+ meses[mes] + ' de ' + ano;
				} 


				function preenche(obj){
					$scope.status = obj.status;
					$scope.data = dataExtenso(obj.data);
					$scope.apresentacao = obj.apresentacao;
					$scope.termino = obj.termino;
					$scope.chefias = obj.chefe;
					$scope.equipes = obj.equipe;
					$scope.acaos = obj.acao;
					$scope.viaturas = obj.viatura;
					$scope.agentes = obj.agentes;
					$scope.showMostrar = true;
				}


				if(factoryAgente.getOrdem()){
					var promise = busca();
					promise.then(function(data){
					var obj = data.data[0];
						if(obj){
							preenche(obj);
							
						}else{
							alert('Número inválido');
						}
					});		


					promise.catch(function(err){
					alert(err);
					})
				}
					

				$scope.doRefresh = function(){
					$state.go('assentamento');
				}

	
}])