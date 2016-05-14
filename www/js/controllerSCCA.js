angular.module('starter.controllers')
.controller('cucaCtrl', ['$scope', '$state', 'inscricaofactory', function($scope, $state, inscricaofactory){
	$scope.inscricao = 'http://scca.rio.rj.gov.br/index.php/online?im=' + inscricaofactory.get();
	$scope.doRefresh = function(){
		$state.go('assentamento');
	}
}])


//http://scca.rio.rj.gov.br/index.php/online?im=80082827;