angular.module('starter.controllers', [])

.controller('multasCtrl', ['$scope', 'factoryAutorizado', '$state', 'tipificaService', 'loginFactory', 'factoryPontos', function($scope, factoryAutorizado, $state, tipificaService, loginFactory, factoryPontos){
      $scope.titulo = 'INSC. MUNICIPAL: ' + factoryAutorizado.getIM();
      $scope.lista = '';
      $scope.multa = '';

      $scope.add = function(){
          var artigo = document.getElementById("artigo").value;
          var inciso = document.getElementById("inciso").value;
          var informa = tipificaService.listar(artigo, inciso);
          if(informa.length > 0){
            $scope.pontos = informa[0].pontos;
            $scope.multa = '(artigo: ' + artigo   + ' inciso: ' + inciso + ')';
            $scope.lista = 
            {
                artigo: 'Artigo: ' + artigo + ' Inciso: ' + inciso,
                texto: informa[0].texto,
                valor: 'Valor: ' + informa[0].valor,
                pontos: 'Pontos: ' + informa[0].pontos
            }
          }
          

      }

      $scope.clear = function(){//atual savalr()
          loginFactory.criar(factoryAutorizado.get());
          $scope.multa = '';
          $scope.lista = '';
          document.getElementById('artigo').selectedIndex = 0;
          document.getElementById('inciso').selectedIndex = 0;
          $state.go('assentamento');
          
      }

      $scope.confirm = function(){
          var artigo = document.getElementById("artigo").value;
          var inciso = document.getElementById("inciso").value;
          var informa = tipificaService.listar(artigo, inciso);
          if(informa.length > 0){
            $scope.pontos += factoryPontos.getPontos();
            factoryPontos.setPontos($scope.pontos);
            factoryAutorizado.setMulta($scope.multa);
            factoryAutorizado.setPontos($scope.pontos);
            alert("Inseridas com sucesso.");       
          }
      }

      $scope.exit = function(){
        return navigator.app.exitApp()
      }


}])

.controller('vistoriaCtrl', ['$http','factoryVistoria', '$scope', 'factoryAgente', 'factoryLocaliza', '$cordovaCamera', function($http, factoryVistoria, $scope, factoryAgente, factoryLocaliza, $cordovaCamera){
  $scope.testar = function(){
    var agente = factoryAgente.get();
    var local = factoryLocaliza.get();
    var numero = document.getElementById('numero').value;
    var servico = document.getElementById('servico').value;
    var acao = document.getElementById('acao').value;
    var comentario = document.getElementById('comentarios').value;


    vistoria = 
    {
      numero: (numero || ''),
      servico: (servico || ''),
      acao: (acao || ''),
      comentario: (comentario || ''),
      hora: (local.hora || ''),
      latitude: (local.latitude || 0),
      longitude: (local.longitude || 0)
    }
    
    factoryVistoria.set(agente.ordem, agente.nome, agente.matricula, vistoria.numero, vistoria.servico, vistoria.acao, vistoria.comentario, vistoria.hora, vistoria.latitude, vistoria.longitude);
    factoryVistoria.save(factoryVistoria.get());
  }

  $scope.tirarFoto = function(){
     var options =
    {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: true,
          correctOrientation: false
    };


    $cordovaCamera.getPicture(options)
    .then(function(data){
     var agente = factoryAgente.get();
     var documento = document.getElementById('numero').value;
     var servico = document.getElementById('servico').value;
     var acao = document.getElementById('acao').value;

      var foto = 
        {
          agente: agente.nome,
          ordem: agente.ordem,
          data: agente.data,
          documento: documento,
          servico: servico,
          acao: acao,
          foto: data
        }

      var promisse = $http.post('https://ccuanexos.herokuapp.com/imagem', foto);
      promisse.then(function(data){
      })

    }, function(err){
      alert('Não foi possível salvar a foto, tente novamente.')
    })
  }

}])

.controller('loginCtrl', ['$scope',  '$state', 'loginFactory', function($scope, $state, loginFactory){
    $scope.entrar = function(){
      loginFactory.logar();             
    }//fim do método entrar
  
}])


.controller('assentamentoCtrl', ['$scope', 'factoryAutorizado', '$state', 'tipificaService', 'loginFactory', 'factoryAgente', 'factoryLocaliza', 'factoryPontos', function($scope,  factoryAutorizado, $state, tipificaService, loginFactory, factoryAgente, factoryLocaliza, factoryPontos){
      $scope.titulo = factoryAgente.getOrdem();
      $scope.clickInconformidade = false;
      $scope.clickConformidade = false;
      $scope.clickEncerrar = true;
      $scope.listaEscolha = ['', 'CONFORMIDADE', 'INCONFORMIDADE', 'AUSENTE', 'PREPOSTO', 'TERCEIROS', 'VISTORIA','VER OS']
      $scope.clickSolicitar = false;
      
      if(factoryAgente.getChefe()){
        $scope.listaEscolha.push('SOLICITAR');
      }
      
      
    $scope.buscar = function(){

        document.getElementById('titular').value = 'carregando...'
        document.getElementById('situacao').value = 'carregando... '                     
        document.getElementById('preposto').value =  'carregando...'

          factoryAutorizado.extrair(document.getElementById('im').value);
          factoryLocaliza.localiza();
          $scope.proteger = true;


    }//fim do método buscar

    $scope.limpar = function(){
      $scope.proteger = false;
      document.getElementById("im").value = '';
      document.getElementById("titular").value = '';
      document.getElementById("preposto").value = '';
      document.getElementById('situacao').value = '';
      
    };//fim do método limpar

    $scope.selecionar = function(){
        if (document.getElementById('status').value == 'INCONFORMIDADE') {
            $scope.clickConformidade = false;
            $scope.clickInconformidade = true;
            $scope.clickEncerrar = false;
            $scope.clickVistoria = false;
            $scope.clickSolicitar = false;
            $scope.clickVisualisar = false;
        }else if (document.getElementById('status').value == 'VISTORIA'){
            $scope.clickConformidade = false;
            $scope.clickInconformidade = false;
            $scope.clickEncerrar = false;
            $scope.clickVistoria = true
            $scope.clickSolicitar = false;
            $scope.clickVisualisar = false;
        }else if (document.getElementById('status').value == 'SOLICITAR'){
            $scope.clickConformidade = false;
            $scope.clickInconformidade = false;
            $scope.clickEncerrar = false;
            $scope.clickVistoria = false;
            $scope.clickSolicitar = true;
            $scope.clickVisualisar = false;
        }else if (!document.getElementById('status').value){
            $scope.clickInconformidade = false;
            $scope.clickConformidade = false;
            $scope.clickEncerrar = true;
            $scope.clickVistoria = false;
            $scope.clickSolicitar = false;
            $scope.clickVisualisar = false;
        }else if (document.getElementById('status').value == 'VER OS'){
            $scope.clickConformidade = false;
            $scope.clickInconformidade = false;
            $scope.clickEncerrar = false;
            $scope.clickVistoria = false;
            $scope.clickSolicitar = false;
            $scope.clickVisualisar = true;
        }else{
            $scope.clickConformidade = true;
            $scope.clickInconformidade = false;
            $scope.clickEncerrar = false;
            $scope.clickVistoria = false;
            $scope.clickSolicitar = false;
            $scope.clickVisualisar = false;
        }
    };//fim do método selecionar
    var conformidade = function(){
      //vou aproveitar e atualizar o logado no objeto autorizado
      
     var flag;
      if(document.getElementById('status').value === 'INCONFORMIDADE'){
        flag = 'INCONFORME';
        factoryAutorizado.setEstado(flag);
      }else if(document.getElementById('status').value === 'CONFORMIDADE'){
        flag = 'CONFORME';
        factoryAutorizado.setEstado(flag);
      }else if(document.getElementById('status').value === 'AUSENTE') {
        flag = 'AUSENTE';
        factoryAutorizado.setEstado(flag);
      }else if(document.getElementById('status').value === 'PREPOSTO') {
        flag = 'PREPOSTO';
        factoryAutorizado.setEstado(flag);
      }else if(document.getElementById('status').value === 'TERCEIROS') {
        flag = 'TERCEIROS';
        factoryAutorizado.setEstado(flag);
      }

    }//fim dda função conformidade

    var logado = function(){
        var local = factoryLocaliza.get();
        var usuario = factoryAgente.get();
        factoryAutorizado.setNome(usuario.nome);
        factoryAutorizado.setMatricula(usuario.matricula);
        factoryAutorizado.setOrdem(usuario.ordem);
        factoryAutorizado.setData(usuario.data);
        factoryAutorizado.setLatitude(local.latitude);
        factoryAutorizado.setLongitude(local.longitude);
        factoryAutorizado.sethoraAutuacao(local.hora);

    }

    $scope.novaFiscalizacao = function(){
      logado();
      conformidade();
      $scope.limpar();
      loginFactory.criar(factoryAutorizado.get());
    };//fim do método novaFiscalização

    $scope.multar = function(){
      $scope.multas = 0;
      factoryPontos.setPontos(0);
      logado();
      conformidade();
      $state.go('multas');      
    };//fim do método multar

    $scope.testar = function(){
      //teste
        //loginFactory.logar();
    };//fim do método testar

    $scope.vistoriar = function(){
    factoryLocaliza.localiza();
    $state.go('vistoria')

  }//fim do método vistoriar

    $scope.encerrar = function(){
      $state.go('login');
      ionic.Platform.exitApp();
    }

    $scope.solicitar = function(){
      $state.go('solicitacao');
    }

      $scope.visualisar = function(){
      $state.go('numero');
    }

}])

.controller('solicitacaoCtrl', ['$scope','$state', 'apoioFactory', function($scope, $state, apoioFactory){
  $scope.hora = ['','00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];
  $scope.bairros = ['','Abolição', 'Acari',' Água Santa', 'Alto da Boa Vista', 'Anchieta', 'Andaraí', 'Anil', 'Bancários', 'Bangu', 'Barra da Tijuca', 'Barra de Guaratiba', 'Barros Filho', 'Benfica', 'Bento Ribeiro', 'Bonsucesso', 'Botafogo', 'Brás de Pina', 'Cachambi', 'Cacuia', 'Caju','Camorim', 'Campinho', 'Campo dos Afonsos', 'Campo Grande', 'Cascadura', 'Catete', 'Catumbi', 'Cavalcanti', 'Centro', 'Cidade de Deus', 'Cidade Nova', 'Cidade Universitária', 'Cocotá', 'Coelho Neto', 'Colégio', 'Complexo do Alemão', 'Copacabana', 'Cordovil', 'Cosme Velho', 'Cosmos', 'Costa Barros', 'Curicica', 'Del Castilho', 'Deodoro', 'Encantado', 'Engenheiro Leal', 'Engenho da Rainha', 'Engenho de Dentro', 'Engenho Novo', 'Estácio', 'Flamengo', 'Freguesia - IG', 'Freguesia - JPG', 'Galeão', 'Gamboa', 'Gardênia Azul', 'Gávea', 'Gericinó', 'Glória', 'Grajaú', 'Grumari', 'Guadalupe', 'Guaratiba', 'Higienópolis', 'Honório Gurgel', 'Humaitá', 'Inhaúma', 'Inhoaíba', 'Ipanema', 'Irajá', 'Itanhangá', 'Jacaré', 'Jacarepaguá', 'Jacarezinho', 'Jardim América', 'Jardim Botânico', 'Jardim Carioca', 'Jardim Guanabara', 'Jardim Sulacap', 'Joá', 'kosmos', 'Lagoa', 'Lapa', 'Laranjeiras', 'Leblon', 'Leme', 'Lins de Vasconcelos', 'Madureira', 'Magalhães Bastos', 'Mangueira', 'Manguinhos', 'Maracanã', 'Maré', 'Marechal Hermes', 'Maria da Graça', 'Méier', 'Moneró', 'Olaria', 'Oswaldo Cruz', 'Paciência', 'Padre Miguel', 'Paquetá', 'Parada de Lucas', 'Parque Anchieta', 'Parque Columbia', 'Pavuna', 'Pechincha', 'Pedra de Guaratiba', 'Penha', 'Penha Circular', 'Piedade', 'Pilares', 'Pitangueiras', 'Portuguesa', 'Praça da Bandeira', 'Praça Seca', 'Praia da Bandeira', 'Quintino Bocaiúva', 'Ramos', 'Realengo', 'Recreio dos Bandeirantes', 'Riachuelo', 'Ribeira', 'Ricardo de Albuquerque', 'Rio Comprido', 'Rocha', 'Rocha Miranda', 'Rocinha', 'Sampaio', 'Santa Cruz', 'Santa Teresa', 'Santíssimo', 'Santo Cristo', 'São Conrado', 'São Cristóvão', 'São Francisco Xavier', 'Saúde', 'Senador Camará', 'Senador Vasconcelos', 'Sepetiba', 'Tanque', 'Taquara', 'Tauá', 'Tijuca', 'Todos os Santos', 'Tomás Coelho', 'Turiaçu', 'Urca', 'Vargem Grande', 'Vargem Pequena', 'Vasco da Gama', 'Vaz Lobo', 'Vicente de Carvalho', 'Vidigal', 'Vigário Geral', 'Vila Cosmos', 'Vila da Penha', 'Vila Isabel', 'Vila Militar', 'Vila Valqueire', 'Vista Alegre', 'Zumbi']
  $scope.motivos = ['', 'Notificação', 'Multa', 'Fisc. Autorizados', 'Desocupação', 'Ret. Equipametos']
  $scope.solicitaOpcoes = ['', 'limpar', 'escolher apoio', 'salvar', 'sair','inicio']
  $scope.showLimpar = false;
  $scope.showApoio = false;
  $scope.showInicio = false;
  $scope.showSalvar = false;
  $scope.showEncerrar = false;

  $scope.opcaoSolicitacao = function(){
    var opt = document.getElementById('solicitaOpcao').value
    if(opt.length > 1){
      if(opt === 'limpar'){
        $scope.showLimpar = true;
        $scope.showApoio = false;
        $scope.showInicio = false;
        $scope.showSalvar = false;
        $scope.showEncerrar = false;
      }else if(opt === 'escolher apoio'){
        $scope.showLimpar = false;
        $scope.showApoio = true;
        $scope.showInicio = false;
        $scope.showSalvar = false;
        $scope.showEncerrar = false;
      }else if(opt === 'salvar'){
        $scope.showLimpar = false;
        $scope.showApoio = false;
        $scope.showInicio = false;
        $scope.showSalvar = true;
        $scope.showEncerrar = false;
      }else if(opt === 'sair'){
        $scope.showLimpar = false;
        $scope.showApoio = false;
        $scope.showInicio = false;
        $scope.showSalvar = false;
        $scope.showEncerrar = true;
      }else if(opt === 'inicio'){
        $scope.showLimpar = false;
        $scope.showApoio = false;
        $scope.showInicio = true;
        $scope.showSalvar = false;
        $scope.showEncerrar = false;
      }
    }else{
        $scope.showLimpar = false;
        $scope.showApoio = false;
        $scope.showInicio = false;
        $scope.showSalvar = false;
        $scope.showEncerrar = false;
    }
  }

  function limpar(){
    document.getElementById('hora').selectedIndex = 0;
    document.getElementById('bairro').selectedIndex = 0;
    document.getElementById('motivo').selectedIndex = 0;
    document.getElementById('data').value = null;
    document.getElementById('ponto').value = null;
  }

  $scope.limpar = function(){
    limpar();
  }

  $scope.apoiar = function(){
    $state.go('apoio')
    apoioFactory.zeraPosicao();
  }

  $scope.iniciar = function(){
    $state.go('assentamento');
  }

  $scope.encerrar = function(){
      ionic.Platform.exitApp();
  }

  //document.getElementById('artigo').selectedIndex = 0;

}])

.controller('apoioCtrl', ['$scope', 'apoioFactory', '$state', function($scope, apoioFactory, $state){
  $scope.apoio = ['', 'AGENTE(S) GM', 'EQUIPE(S) GET', 'EQUIPE(S) GOE', 'PATRULHA(S) DA PMERJ', 'CAMINHÃO(ÕES) COMLURB + TRABALHADORES', 'EQUIPE(S) SECONSEVA + TRABALHADORES', 'RETROESCAVADEIRA(S)', 'EQUIPE(S) RIO-LUZ', 'EQUIPE(S) LIGTH', 'CAMINHÃO(ÕES) BAÚ', 'CAMINHÃO MUNCK', 'REBOQUE(S)', 'FAE(S)'];
  $scope.solicitacao = [];

  function limpar(){
    $scope.solicitacao = [];
  }

  function limpaBox(){
    document.getElementById('orgao').selectedIndex = 0;
    document.getElementById('quantidade').value = null;
  }
  
  $scope.add = function(){

    var apoio = document.getElementById("orgao").value
    var quantidade = document.getElementById('quantidade').value;
    if(apoio && quantidade){
      apoioFactory.setPosicao();
      var posicao = apoioFactory.getPosicao();
      $scope.solicitacao.push('0' + posicao + ') ' + quantidade + ' ' + apoio);
      apoioFactory.setApoio($scope.solicitacao.toString());
      console.log(apoioFactory.getApoio());
    }

    limpaBox();
    
  }

  $scope.clear = function(){
    limpar();
    limpaBox();
    apoioFactory.zeraPosicao();
  }

  $scope.save = function(){
    $state.go('solicitacao');
    limpar();
  }
  
  
}])

.factory('apoioFactory', [function(){
  var solicitacao = {};
  solicitacao.posicao = 0;


  var setApoio = function(value){
    return solicitacao.apoio = value;
  }

  var getApoio = function(){
    return solicitacao.apoio;
  }

  var setPosicao = function(){
    return solicitacao.posicao += 1; 
  }

  var getPosicao = function(){
    return solicitacao.posicao;
  }

  var zeraPosicao = function(){
    return solicitacao.posicao = 0;
  }



  return {
    setApoio: setApoio,
    getApoio: getApoio,
    setPosicao: setPosicao,
    getPosicao: getPosicao,
    zeraPosicao: zeraPosicao
  }

}])


.factory('factoryAgente', function(){
 
    var agente = {nome: '', matricula: '', ordem: 0, data: '', chefe: false};
     
    var get = function(){
      return agente;
    };

 

    var set = function(nome, matricula, ordem, data, chefe){
      return agente =  {nome: nome, matricula: matricula, ordem: ordem, data: data, chefe: chefe};
    };

     var getOrdem = function(){
      return agente.ordem;
    }

    var getChefe = function(){
      return agente.chefe;
    }

    return {
        get: get,
        set: set,
        getOrdem: getOrdem,
        getChefe: getChefe
    }
})

.factory('factoryAutorizado', function(){
   var autorizado = 
    {
      nome: '', 
      matricula: '', 
      ordem: 0, 
      data: '',
      im: '',
      titular: '',
      preposto: '',
      cpf: '',
      local: '',
      situacao: '',
      conformidade: false,
      multas: '',
      latitude: '',
      longitude: '',
      horaAutuacao: '',
      pontos: 0
    }

    var setLatitude = function(value){
      return autorizado.latitude = value;
    }

    var setLongitude = function(value){
      return autorizado.longitude = value;
    }

    var sethoraAutuacao = function(value){
      return autorizado.horaAutuacao = value;
    }

    var setNome = function(value){
      return autorizado.nome = value;
    }

    var setMatricula = function(value){
      return autorizado.matricula = value;
    }

    var setOrdem = function(value){
      return autorizado.ordem = value;
    }

    var setData = function(value){
      return autorizado.data = value;
    }

    var extrair = function(value){
      $.ajax(
            {
                    url: 'http://scca.rio.rj.gov.br/index.php/online?im=' + value,
                    type: 'GET',
                    success: function(res)
                      {
                                var headline = $(res.responseText).text();
                                var regexTitular = /Nome(\D)+(\s)+Data/g;
                                var regexCPF = /CPF(\w)+/g;
                                var regexLocal = /Local(\D)+(nº)?/g;
                                var regexStatus = /Situa(.)+(\s)+TITULAR/g
                                var regexTuap = /[0-9]{2}-[0-9]{2}-[0-9]{4}[0-9]{2}-[0-9]{2}-[0-9]{4}/g
                                var nome = headline.match(regexTitular);
                                var cpfTitular = headline.match(regexCPF)
                                var localTitular = headline.match(regexLocal);
                                var statusTitular = headline.match(regexStatus);
                                var tuap = headline.match(regexTuap);
                                  if(nome){
                                      document.getElementById('titular').value = nome[0].replace('Nome', '').replace('Data', '').trim();
                                      var titular = nome[0].replace('Nome', '').replace('Data', '').trim();
                                      var cpf = cpfTitular[0].replace('CPF', '').trim();
                                      var local = localTitular[0].replace('Local', '').replace('nº', '').trim();
                                      var situacao = statusTitular[0].replace('Situação', '').replace('TITULAR', '').trim() + ' (ÚLT. TUAP PAGA: ' + tuap[0].substring(10,20)+')';
                                      document.getElementById('situacao').value = situacao;
                                      
                                           if(nome[01]){
                                            var preposto =  nome[1].replace('Nome', '').replace('Data', '').trim();
                                            set(value, titular, preposto, cpf, local, situacao,'');
                                            document.getElementById('preposto').value =  nome[1].replace('Nome', '').replace('Data', '').trim();
                                          }else{
                                            var preposto = 'SEM PREPOSTO';
                                            set(value, titular, preposto, cpf, local, situacao, false);
                                            document.getElementById('preposto').value = 'SEM PREPOSTO';
                                          }
                                    }else{
                                      alert('IM não localizada!\nClique em Limpar para prosseguir.');
                                    }                                                           
                    }//fim do callback sucess
           });//fim do método ajax
    }//fim mo método extrair


    var set = function(im, titular, preposto, cpf, local, situacao, conformidade){
      return autorizado =
      {
        nome: '',
        matricula: '',
        ordem: 0,
        data: '',
        im: im, 
        titular: titular, 
        preposto: preposto, 
        cpf: cpf, 
        local: local, 
        situacao: situacao, 
        conformidade: conformidade, 
        multas: '',
        latitude: '',
        longitude: '',
        horaAutuacao: '',
        pontos: 0
      }
    }

    var setPontos = function(value){
      return autorizado.pontos = value;
    }

    var getPontos = function(){
      return autorizado.pontos;
    }

    var setEstado = function(value, nome, matricula, ordem, data){
      return  autorizado.conformidade = value;

    }

    var setMulta = function(value){
      var aux = get();
      return (aux.multas += value).trim();
    }

    var get = function(){
      return autorizado;
    }

    var getIM = function(){
      return autorizado.im;
    }

    var getStatus = function(){
      return autorizado.situacao;
    }

    return {
      get: get,
      set: set,
      setNome: setNome,
      setMatricula: setMatricula,
      setOrdem: setOrdem,
      setData: setData,
      extrair: extrair,
      setEstado: setEstado,
      setMulta: setMulta,
      getIM: getIM,
      getStatus: getStatus,
      setLatitude: setLatitude,
      setLongitude: setLongitude,
      sethoraAutuacao: sethoraAutuacao,
      getPontos: getPontos,
      setPontos: setPontos
    }

});

